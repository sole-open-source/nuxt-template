<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const schema = toTypedSchema(
  z
    .object({
      username: z.string().min(1, 'El usuario o correo es obligatorio.').max(150),
      password: z.string().min(8, 'Debe tener al menos 8 caracteres.').max(128),
      confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Las contraseñas no coinciden.',
      path: ['confirmPassword'],
    }),
)

const feature = useAuthFeature()
const { handleSubmit, isSubmitting, errors, defineField } = useForm({ validationSchema: schema })

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

const onSubmit = handleSubmit((values) => feature.register(values))
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Crea tu cuenta</CardTitle>
        <CardDescription>Completa tus datos para comenzar</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <FieldGroup>
            <Field :data-invalid="!!errors.username">
              <FieldLabel for="username">Usuario o correo electrónico</FieldLabel>
              <Input
                id="username"
                v-model="username"
                autocomplete="username"
                placeholder="tu.usuario o tucorreo@ejemplo.com"
                v-bind="usernameAttrs"
              />
              <FieldError :errors="errors.username ? [errors.username] : []" />
            </Field>

            <Field :data-invalid="!!errors.password">
              <FieldLabel for="password">Contraseña</FieldLabel>
              <Input
                id="password"
                v-model="password"
                type="password"
                autocomplete="new-password"
                v-bind="passwordAttrs"
              />
              <FieldError :errors="errors.password ? [errors.password] : []" />
            </Field>

            <Field :data-invalid="!!errors.confirmPassword">
              <FieldLabel for="confirmPassword">Confirmar contraseña</FieldLabel>
              <Input
                id="confirmPassword"
                v-model="confirmPassword"
                type="password"
                autocomplete="new-password"
                v-bind="confirmPasswordAttrs"
              />
              <FieldError :errors="errors.confirmPassword ? [errors.confirmPassword] : []" />
            </Field>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }}
              </Button>
              <FieldError v-if="feature.error.value" :errors="[feature.error.value]" />
              <FieldDescription class="text-center">
                ¿Ya tienes cuenta?
                <NuxtLink to="/login" class="underline underline-offset-4">Inicia sesión</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
