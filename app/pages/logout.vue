<script setup lang="ts">
definePageMeta({ layout: 'auth' })

useHead({ title: 'Sign out' })

const { signOut } = useAuth()
const isSigningOut = ref(false)

// Reached by visiting /logout directly; the sidebar calls `signOut` too. Never
// on load: signing out on a GET means a link prefetch can do it for you.
async function confirm() {
  isSigningOut.value = true
  await signOut()
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <h1 class="text-xl font-semibold">Sign out of your account?</h1>
    <Button :disabled="isSigningOut" @click="confirm">Sign out</Button>
  </div>
</template>
