<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: [],
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Iniciar sesión</h1>
      <p class="text-muted-foreground text-sm">Ingresa tus credenciales para continuar</p>
    </div>
    <!-- LoginForm goes here: components/domain/auth/LoginForm.vue -->
  </div>
</template>
