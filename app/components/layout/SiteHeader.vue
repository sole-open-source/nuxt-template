<script setup lang="ts">
import { APP_BRANDING } from '~/config/app'
import { NAVIGATION_ITEMS } from '~/config/navigation'
import { isPrefixOf } from '~/core/permissions'

// Page title from NAVIGATION_ITEMS. Longest route first, so a nested route
// resolves to its own entry rather than to a shallower one.
const byDepth = [...NAVIGATION_ITEMS].sort((a, b) => b.to.length - a.to.length)

const route = useRoute()
const pageTitle = computed(
  () => byDepth.find((item) => isPrefixOf(item.to, route.path))?.title ?? APP_BRANDING.name,
)
</script>

<template>
  <header
    class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear"
  >
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
      <h1 class="text-base font-medium">{{ pageTitle }}</h1>
    </div>
  </header>
</template>
