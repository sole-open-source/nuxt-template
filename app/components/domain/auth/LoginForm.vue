<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const schema = toTypedSchema(
  z.object({
    email: z.string().email('Ingresa un correo válido.'),
    password: z.string().min(1, 'La contraseña es obligatoria.'),
  }),
)

const feature = useAuthFeature()
const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit((values) => feature.login(values))
</script>

<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
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
          <Input type="password" autocomplete="current-password" v-bind="field" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <p v-if="feature.error.value" class="text-sm text-destructive">
      {{ feature.error.value }}
    </p>

    <Button type="submit" class="w-full" :disabled="isSubmitting">
      {{ isSubmitting ? 'Ingresando...' : 'Iniciar sesión' }}
    </Button>

    <p class="text-center text-sm text-muted-foreground">
      ¿No tienes cuenta?
      <NuxtLink to="/register" class="font-medium text-primary hover:underline">Regístrate</NuxtLink>
    </p>
  </form>
</template>
