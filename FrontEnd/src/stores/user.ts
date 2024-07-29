import { ref, computed, watch, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import router from "@/router/router";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface RegisterData {
    role: string;
    email: string;
    lastName: string;
    firstName: string;
    password: string;
    password_confirm: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);

    const isAuthenticated = computed(() => !!user.value);

    const persistState = () => {
        localStorage.setItem('auth', JSON.stringify({
            user: user.value,
            token: token.value,
        }));
        if (refreshToken.value) {
            document.cookie = `refreshToken=${refreshToken.value}; path=/; Secure; SameSite=Strict`;
        }
    };

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    };

    const loadState = () => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
            const { user: storedUser, token: storedToken } = JSON.parse(storedAuth);
            user.value = storedUser;
            token.value = storedToken;
            refreshToken.value = getCookie('refreshToken');
            if (token.value) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            }
        }
    };

    watch(
        () => ({ user: user.value, token: token.value, refreshToken: refreshToken.value }),
        persistState,
        { deep: true }
    );

    async function register(userData: RegisterData) {
        try {
            const response = await axiosInstance.post('auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function login(email: string, password: string) {
        try {
            const response = await axiosInstance.post('auth/login', { email, password });
            if (response.data.message.includes('Veuillez confirmer votre email')) {
                throw new Error(response.data.message);
            }
            user.value = response.data.user;
            token.value = response.data.accessToken;
            refreshToken.value = response.data.refreshToken;
            if (token.value) {
                localStorage.setItem('authToken', token.value);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            }
            startRefreshTokenTimer();
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function refreshTokenFunc() {
        if (refreshToken.value) {
            try {
                const response = await axiosInstance.post('auth/refresh-token', { refreshToken: refreshToken.value });
                token.value = response.data.accessToken;
                refreshToken.value = response.data.refreshToken;
                if (token.value) {
                    localStorage.setItem('authToken', token.value);
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
                }
                document.cookie = `refreshToken=${refreshToken.value}; path=/; Secure; SameSite=Strict`;
            } catch (error) {
                logout();
            }
        } else {
            console.error('No refresh token available for refreshing');
        }
    }

    let refreshTokenInterval: number | null = null;

    function startRefreshTokenTimer() {
        if (refreshTokenInterval) {
            clearInterval(refreshTokenInterval);
        }
        refreshTokenInterval = window.setInterval(refreshTokenFunc, 14 * 60 * 1000);
    }

    async function logout() {
        if (token.value) {
            try {
                await axiosInstance.post('auth/logout', { token: token.value }, {
                    headers: { 'Authorization': `Bearer ${token.value}` }
                });
            } catch (error) {
                console.error('Erreur de déconnexion:', error);
            } finally {
                user.value = null;
                token.value = null;
                refreshToken.value = null;
                localStorage.removeItem('authToken');
                localStorage.removeItem('auth');
                document.cookie = 'refreshToken=; Max-Age=0; path=/;';
                delete axiosInstance.defaults.headers.common['Authorization'];
                router.push('/');
                if (refreshTokenInterval) {
                    clearInterval(refreshTokenInterval);
                }
            }
        }
    }

    async function requestPasswordReset(email: string) {
        try {
            const response = await axiosInstance.post('auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function resetPassword(token: string, newPassword: string, newPasswordConfirm: string) {
        try {
            const response = await axiosInstance.patch('auth/reset-password', { token, newPassword, newPasswordConfirm });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function fetchUser() {
        try {
            const response = await axiosInstance.get('auth/me');
            user.value = response.data;
        } catch (error) {
            throw error;
        }
    }

    async function fetchUsers() {
        try {
            const response = await axiosInstance.get('auth/users');
            return response.data.users;
        } catch (error) {
            throw error;
        }
    }

    async function deleteUser(id: number) {
        try {
            await axiosInstance.delete(`/users/${id}`);
            await fetchUsers();
        } catch (error) {
            throw error;
        }
    }

    async function updateProfile(profileData) {
        try {
            const response = await axiosInstance.patch(`/auth/user/${user.value?.id}`, profileData);
            user.value = response.data.user;
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    }

    async function updatePassword(currentPassword, newPassword) {
        try {
            const response = await axiosInstance.patch(`/auth/user/${user.value?.id}`, { password: newPassword });
            return response.data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    }

    loadState();

    watchEffect(() => {
        if (isAuthenticated.value) {
            startRefreshTokenTimer();
        }
    });

    return {
        updateProfile,
        updatePassword,
        deleteUser,
        fetchUsers,
        user,
        token,
        refreshToken,
        isAuthenticated,
        register,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        refreshTokenFunc,
        fetchUser,
    };
});