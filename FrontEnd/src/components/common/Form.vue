<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in fields" :key="field.name">
      <label :for="field.name">{{ field.label }}</label>
      <input
          :id="field.name"
          v-model="field.value"
          :type="field.type"
          :name="field.name"
      />
      <span v-if="errors[field.name]" class="error">{{ errors[field.name] }}</span>
    </div>
    <button type="submit" :disabled="isSubmitting">Soumettre</button>
    <div v-if="serverError" class="error">{{ serverError }}</div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from '@/composables/useForm';

const props = defineProps<{
  fields: Array<{
    name: string;
    type: string;
    label: string;
    value: any;
    transform?: (value: any) => any;
  }>;
  validationSchema: any;
  onSubmit: (data: any) => Promise<void>;
}>();

const { fields, errors, isSubmitting, serverError, handleSubmit } = useForm(
    props.fields,
    props.validationSchema,
    props.onSubmit
);
</script>