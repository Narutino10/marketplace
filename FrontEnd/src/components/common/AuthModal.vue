<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="modal">
        <div class="modal-overlay" @click="closeModal"></div>
        <div class="modal-content">
          <button @click="closeModal" class="close-button">&times;</button>

          <!-- Formulaire de connexion -->
          <div v-if="isLogin" class="auth-container">
            <h2 class="auth-title">Connexion</h2>
            <form @submit.prevent="handleLogin" class="auth-form">
              <div class="form-group">
                <label for="email" class="form-label">Email :</label>
                <input v-model="email" id="email" type="email" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="password" class="form-label">Mot de passe :</label>
                <input v-model="password" id="password" type="password" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="rememberMe" class="form-label">
                  <input type="checkbox" v-model="rememberMe" id="rememberMe" />
                  Se souvenir de moi
                </label>
              </div>
              <button type="submit" class="btn btn-primary">Se connecter</button>
            </form>
            <div class="forgot-password">
              <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
            </div>
          </div>

          <!-- Formulaire d'inscription -->
          <div v-else class="auth-container">
            <h2 class="auth-title">Inscription</h2>
            <form @submit.prevent="handleRegister" class="auth-form">
              <!--<div class="form-group">
                <label for="role" class="form-label">Rôle :</label>
                <select v-model="role" id="role" class="form-control" required>
                  <option value="" disabled>Sélectionnez un rôle</option>
                  <option value="admin">Administrateur</option>
                  <option value="manager">Gestionnaire</option>
                  <option value="user">Utilisateur</option>
                </select>
              </div>-->
              <div class="form-group">
                <label for="email" class="form-label">Email :</label>
                <input v-model="email" id="email" type="email" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="firstName" class="form-label">Prénom :</label>
                <input v-model="firstName" id="firstName" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="lastName" class="form-label">Nom :</label>
                <input v-model="lastName" id="lastName" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label for="password" class="form-label">Mot de passe :</label>
                <input v-model="password" id="password" type="password" class="form-control" required />
                <span v-if="!isPasswordValid" class="text-danger">Le mot de passe doit contenir au moins 12 caractères avec au moins une lettre minuscule, une lettre majuscule, un chiffre et un symbole.</span>
              </div>
              <div class="form-group">
                <label for="password_confirm" class="form-label">Confirmer le mot de passe :</label>
                <input v-model="passwordConfirm" id="password_confirm" type="password" class="form-control" required />
                <span v-if="password !== passwordConfirm" class="text-danger">Les mots de passe ne correspondent pas.</span>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">S'inscrire</button>
            </form>
          </div>

          <div class="toggle-auth">
            <span @click="toggleAuth">{{ isLogin ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous' }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/user';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const role = ref('user');
const firstName = ref('');
const lastName = ref('');
const passwordConfirm = ref('');
const isLogin = ref(true);
const rememberMe = ref(false);

watch(() => props.isVisible, (newValue) => {
  if (!newValue) {
    email.value = '';
    password.value = '';
    role.value = '';
    firstName.value = '';
    lastName.value = '';
    passwordConfirm.value = '';
  }
});

const isPasswordValid = computed(() => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return regex.test(password.value);
});

const isFormValid = computed(() => {
  if (isLogin.value) {
    return email.value && password.value;
  } else {
    return role.value && email.value && firstName.value && lastName.value && password.value && passwordConfirm.value && isPasswordValid.value && password.value === passwordConfirm.value;
  }
});

async function handleLogin() {
  try {
    const response = await authStore.login(email.value, password.value);
    if (rememberMe.value) {
      localStorage.setItem('authToken', response.token);
    } else {
      sessionStorage.setItem('authToken', response.token);
    }
    if (authStore.user?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/home');
    }
    closeModal();
  } catch (error) {
    console.error('Échec de la connexion:', error);
    alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
  }
}

async function handleRegister() {
  try {
    const userData = {
      role: role.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value,
      password_confirm: passwordConfirm.value
    };
    const response = await authStore.register(userData);
    alert(`Inscription réussie ! Réponse :\n${JSON.stringify(response)}`);
    router.push('/home');
    closeModal();
  } catch (error) {
    console.error('Échec de l\'inscription:', error);
    alert('Échec de l\'inscription. Veuillez réessayer.');
  }
}

function toggleAuth() {
  isLogin.value = !isLogin.value;
}

function closeModal() {
  emit('close');
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.auth-container {
  width: 100%;
}

.auth-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
  display: block;
}

.form-control {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.text-danger {
  color: red;
  font-size: 14px;
}

.forgot-password,
.toggle-auth {
  text-align: center;
  margin-top: 15px;
}

.forgot-password a,
.toggle-auth span {
  color: #007bff;
  text-decoration: none;
  cursor: pointer;
}

.forgot-password a:hover,
.toggle-auth span:hover {
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
