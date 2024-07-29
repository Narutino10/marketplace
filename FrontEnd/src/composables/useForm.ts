import { ref, computed } from 'vue';
import { z } from 'zod';
import axiosInstance from "@/services/api";

interface FormField {
    name: string;
    type: string;
    label: string;
    value: any;
    transform?: (value: any) => any;
}

export function useForm(initialFields: FormField[], validationSchema: z.ZodSchema<any>, onSubmit: (data: any) => Promise<void>) {
    const fields = ref(initialFields);
    const errors = ref<Record<string, string>>({});
    const isSubmitting = ref(false);
    const serverError = ref<string | null>(null);

    const formData = computed(() => {
        return fields.value.reduce((acc, field) => {
            acc[field.name] = field.transform ? field.transform(field.value) : field.value;
            return acc;
        }, {} as Record<string, any>);
    });

    const validate = () => {
        try {
            validationSchema.parse(formData.value);
            errors.value = {};
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                errors.value = error.errors.reduce((acc, err) => {
                    acc[err.path[0]] = err.message;
                    return acc;
                }, {} as Record<string, string>);
            }
            return false;
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            isSubmitting.value = true;
            serverError.value = null;

            try {
                await onSubmit(formData.value);
            } catch (error) {
                console.error('Erreur lors de la soumission du formulaire:', error);
                serverError.value = 'Une erreur est survenue lors de la soumission du formulaire.';
            } finally {
                isSubmitting.value = false;
            }
        }
    };

    return {
        fields,
        errors,
        isSubmitting,
        serverError,
        handleSubmit,
    };
}