<script setup lang="ts">
definePageMeta({ layout: false })

// Global auth middleware already ensures only authenticated users reach this route.
// Redirect straight to the app's default landing page.
await navigateTo('/dashboard', { replace: true })
</script>

<template>
    <div />
</template>
