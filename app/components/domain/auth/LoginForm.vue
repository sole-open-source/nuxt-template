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
  z.object({
    username: z.string().min(1, 'Ingresa tu usuario o correo.'),
    password: z.string().min(1, 'La contraseña es obligatoria.'),
  }),
)

const feature = useAuthFeature()
const { handleSubmit, isSubmitting, errors, defineField } = useForm({ validationSchema: schema })

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit((values) => feature.login(values))
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Inicia sesión en tu cuenta</CardTitle>
        <CardDescription>Ingresa tu correo para continuar</CardDescription>
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
                autocomplete="current-password"
                v-bind="passwordAttrs"
              />
              <FieldError :errors="errors.password ? [errors.password] : []" />
            </Field>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Ingresando...' : 'Iniciar sesión' }}
              </Button>
              <Button variant="outline" type="button" disabled title="Próximamente">
                Iniciar sesión con Google
              </Button>
              <FieldError v-if="feature.error.value" :errors="[feature.error.value]" />
              <FieldDescription class="text-center">
                ¿No tienes cuenta?
                <NuxtLink to="/register" class="underline underline-offset-4">Regístrate</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
