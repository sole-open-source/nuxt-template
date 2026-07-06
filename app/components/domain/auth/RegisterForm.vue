<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const schema = toTypedSchema(
  z
    .object({
      name: z.string().min(1, 'El nombre es obligatorio.').max(100),
      email: z.string().email('Ingresa un correo válido.'),
      password: z.string().min(8, 'Debe tener al menos 8 caracteres.').max(128),
      confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden.',
      path: ['confirmPassword'],
    }),
)

const feature = useAuthFeature()
const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit((values) => feature.register(values))
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
    <FormField v-slot="{ field }" name="name">
      <FormItem>
        <FormLabel>Nombre</FormLabel>
        <FormControl>
          <Input autocomplete="name" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ field }" name="email">
      <FormItem>
        <FormLabel>Correo electrónico</FormLabel>
        <FormControl>
          <Input type="email" autocomplete="email" placeholder="tucorreo@ejemplo.com" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ field }" name="password">
      <FormItem>
        <FormLabel>Contraseña</FormLabel>
        <FormControl>
          <Input type="password" autocomplete="new-password" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ field }" name="confirmPassword">
      <FormItem>
        <FormLabel>Confirmar contraseña</FormLabel>
        <FormControl>
          <Input type="password" autocomplete="new-password" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <p v-if="feature.error.value" class="text-sm text-destructive">
      {{ feature.error.value }}
    </p>

    <Button type="submit" class="w-full" :disabled="isSubmitting">
      {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
    </Button>

    <p class="text-center text-sm text-muted-foreground">
      ¿Ya tienes cuenta?
      <NuxtLink to="/login" class="font-medium text-primary hover:underline">Inicia sesión</NuxtLink>
    </p>
  </form>
</template>
