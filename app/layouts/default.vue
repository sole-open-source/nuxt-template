<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar — replace with AppSidebar from components/patterns/ -->
    <aside class="bg-background w-64 border-r">
      <div class="flex h-full flex-col gap-4 p-4">
        <nav class="flex-1">
          <NuxtLink to="/dashboard" class="hover:bg-accent block rounded px-3 py-2 text-sm">
            Dashboard
          </NuxtLink>
        </nav>
        <div class="text-muted-foreground text-xs">
          {{ auth.user?.email }}
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <header class="bg-background border-b px-6 py-3">
        <slot name="header" />
      </header>
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
