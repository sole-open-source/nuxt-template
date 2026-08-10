<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { normalizeError } from '~/core/errors'
import { GOOGLE_SIGN_IN_PATH } from '~/features/auth/google'
import { LoginSchema } from '~/features/auth/schemas'
import { cn } from '~/lib/utils'

const props = defineProps<{
  /** Set when the user comes back from a failed OAuth round trip. */
  signInError?: string | null
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{ success: [] }>()

const config = useRuntimeConfig().public
const showPassword = config.authPasswordEnabled
const showGoogle = config.authGoogleEnabled

const route = useRoute()
// The OAuth round trip loses the query string, so the destination rides along
// and comes back in the state cookie.
const googleSignInUrl = computed(() =>
  typeof route.query.redirect === 'string'
    ? `${GOOGLE_SIGN_IN_PATH}?redirect=${encodeURIComponent(route.query.redirect)}`
    : GOOGLE_SIGN_IN_PATH,
)

const { signIn } = useAuth()
const message = ref<string | null>(null)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
})

const onSubmit = handleSubmit(async (values) => {
  message.value = null
  try {
    await signIn(values)
    emit('success')
  } catch (err) {
    message.value = normalizeError(err).message
  }
})
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Sign in to your account</h1>
      <p class="text-sm text-balance text-muted-foreground">
        <template v-if="showPassword && showGoogle">
          Use your email or a third-party account to sign in.
        </template>
        <template v-else-if="showPassword">Enter your email and password to sign in.</template>
        <template v-else-if="showGoogle">Sign in with your Google account to continue.</template>
      </p>
    </div>

    <p
      v-if="message || signInError"
      class="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
    >
      {{ message ?? signInError }}
    </p>

    <!-- A link, not a fetch: the server mints the OAuth state cookie and redirects. -->
    <Button v-if="showGoogle" as="a" :href="googleSignInUrl" variant="outline" class="w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        aria-hidden="true"
        class="shrink-0"
      >
        <path
          fill="currentColor"
          d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
        />
      </svg>
      Sign in with Google
    </Button>

    <div
      v-if="showPassword && showGoogle"
      class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
    >
      <span class="relative z-10 bg-background px-2 text-muted-foreground">or</span>
    </div>

    <form v-if="showPassword" class="grid gap-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input type="password" autocomplete="current-password" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="w-full" :disabled="isSubmitting">Sign in</Button>
    </form>
  </div>
</template>
