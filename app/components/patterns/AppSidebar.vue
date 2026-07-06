<script setup lang="ts">
import { LayoutDashboard } from '@lucide/vue'
import { useSidebar } from '~/components/ui/sidebar'

const navigation = useNavigationFeature()
const route = useRoute()
const sidebar = useSidebar()

watch(
  () => route.path,
  () => {
    if (sidebar.isMobile.value && sidebar.openMobile.value) {
      sidebar.setOpenMobile(false)
    }
  },
)
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip="Inicio"
            as-child
            class="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
          >
            <NuxtLink to="/">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <LayoutDashboard class="size-4" />
              </div>
              <div class="grid flex-1 text-start text-sm leading-tight">
                <span class="truncate font-semibold">Unergy</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <NavMain :groups="navigation.groups.value" />
    </SidebarContent>

    <SidebarFooter>
      <NavUser />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
