<script setup lang="ts">
import { APP_BRANDING, AUTH_DEFAULT_REDIRECT_PATH } from '~/config/app'
import LoginForm from '~/features/auth/components/LoginForm.vue'
import { decodeRedirect } from '~/features/auth/redirect'

definePageMeta({ layout: 'auth' })

useHead({ title: `${APP_BRANDING.seo.title} — Log in` })

const route = useRoute()

// Set by the OAuth callback when it could not complete the sign-in.
const signInError = computed(() =>
  route.query.error ? 'Could not sign you in. Please try again.' : null,
)

/** Where to land after signing in, honouring the `?redirect=` the auth guard set. */
function onSuccess() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  return navigateTo(decodeRedirect(redirect) ?? AUTH_DEFAULT_REDIRECT_PATH, { replace: true })
}
</script>

<template>
  <LoginForm :sign-in-error="signInError" @success="onSuccess" />
</template>
