<script setup lang="ts">
import { LogOut } from '@lucide/vue'

const route = useRoute()
const navigation = useNavigationFeature()
const auth = useAuthFeature()
</script>

<template>
  <Sidebar>
    <SidebarHeader class="px-3 py-4 text-sm font-semibold">Unergy</SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigation.items.value" :key="item.to">
              <SidebarMenuButton as-child :is-active="route.path.startsWith(item.to)">
                <NuxtLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="flex items-center justify-between gap-2 px-2 py-1">
            <span class="truncate text-xs text-muted-foreground">{{ auth.user.value?.email }}</span>
            <Button variant="ghost" size="icon-sm" title="Cerrar sesión" @click="auth.logout">
              <LogOut />
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
