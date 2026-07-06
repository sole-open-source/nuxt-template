<script setup lang="ts">
import { NAVIGATION_ITEMS } from '~/config/domain'

const route = useRoute()

// Rutas más largas primero, para que /admin/users matche "Administración" y no un item más corto.
const sortedItems = [...NAVIGATION_ITEMS].sort((a, b) => b.to.length - a.to.length)

const pageTitle = computed(() => {
  const pathname = route.path
  const match = sortedItems.find((item) =>
    item.to === '/' ? pathname === '/' : pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
  return match?.label ?? 'App'
})
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-2 border-b">
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ms-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
      <h1 class="text-base font-medium">{{ pageTitle }}</h1>
    </div>
  </header>
</template>
