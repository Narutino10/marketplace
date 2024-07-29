<template>
  <div class="profile-section">
    <h2>Mon Profil</h2>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="name">Nom</label>
        <input type="text" id="name" v-model="profile.firstname" />
      </div>
      <div>
        <label for="name">Nom</label>
        <input type="text" id="name" v-model="profile.lastname" />
      </div>
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="profile.email" />
      </div>
      <!--<div>
        <label for="profile-picture">Photo de Profil</label>
        <input type="file" id="profile-picture" @change="handleProfilePictureChange" />
      </div>-->
      <button type="submit">Mettre à jour</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/user';

const authStore = useAuthStore();

const profile = ref({
  firstname: authStore.user?.firstname + ' ' ,
  lastname: authStore.user?.lastname || '',
  email: authStore.user?.email || ''
});
console.log(profile.value);

watch(() => authStore.user, (newUser) => {
  profile.value.firstname = newUser?.firstName || '';
  profile.value.lastname = newUser?.lastName || '';
  profile.value.email = newUser?.email || '';
});

const updateProfile = () => {
  const [firstName, lastName] = profile.value.name.split(' ');
  authStore.updateProfile({
    firstName,
    lastName,
    email: profile.value.email,
    profilePicture: profile.value.profilePicture
  });
};

const handleProfilePictureChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profile.value.profilePicture = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
.profile-section {
  max-width: 600px;
  margin: auto;
}

.profile-section form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profile-section label {
  font-weight: bold;
}

.profile-section input[type="text"],
.profile-section input[type="email"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.profile-section button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.profile-section button:hover {
  background-color: #1d94d2;
}
</style>
