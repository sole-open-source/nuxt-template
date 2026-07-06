<script setup lang="ts">
import type { NavigationGroupView } from '~/composables/features/navigation/useNavigationFeature'

defineProps<{
  groups: NavigationGroupView[]
}>()

const route = useRoute()

function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <SidebarGroup v-for="group in groups" :key="group.label">
    <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in group.items" :key="item.to">
          <SidebarMenuButton as-child :is-active="isActive(item.to)" :tooltip="item.label">
            <NuxtLink :to="item.to">
              <component :is="item.icon" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
