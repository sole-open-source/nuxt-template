<script setup lang="ts">
import type { Component } from 'vue'

export interface NavItem {
  title: string
  url: string
  icon: Component
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

defineProps<{ groups: NavGroup[] }>()

const route = useRoute()

function isActive(url: string): boolean {
  if (url === '/') return route.path === '/'
  return route.path === url || route.path.startsWith(`${url}/`)
}
</script>

<template>
  <SidebarGroup v-for="group in groups" :key="group.label">
    <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in group.items" :key="item.url">
          <SidebarMenuButton as-child :is-active="isActive(item.url)" :tooltip="item.title">
            <NuxtLink :to="item.url" :aria-current="isActive(item.url) ? 'page' : undefined">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
