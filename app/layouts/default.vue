<script setup lang="ts">
const auth = useAuthFeature()
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar — replace with AppSidebar from components/patterns/ -->
    <aside class="w-64 border-r bg-background">
      <div class="flex h-full flex-col gap-4 p-4">
        <nav class="flex-1">
          <NuxtLink to="/dashboard" class="block rounded px-3 py-2 text-sm hover:bg-accent">
            Dashboard
          </NuxtLink>
        </nav>
        <div class="flex items-center justify-between gap-2">
          <span class="truncate text-xs text-muted-foreground">{{ auth.user.value?.email }}</span>
          <Button variant="ghost" size="sm" @click="auth.logout">Salir</Button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="border-b bg-background px-6 py-3">
        <slot name="header" />
      </header>
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
