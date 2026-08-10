<script setup lang="ts">
import type { SidebarProps } from '~/components/ui/sidebar'
import { useSidebar } from '~/components/ui/sidebar'
import type { NavGroup } from '~/components/layout/NavMain.vue'
import { APP_BRANDING } from '~/config/app'
import { NAVIGATION_GROUP_LABELS, NAVIGATION_ITEMS, NavigationGroup } from '~/config/navigation'
import { ROLE_LABELS } from '~/config/permissions'

const props = withDefaults(defineProps<SidebarProps>(), { collapsible: 'icon' })

const { user, can } = useAuth()
const { isMobile, openMobile, setOpenMobile } = useSidebar()
const authEnabled = useRuntimeConfig().public.authEnabled

// Presentation only — hiding a link is not access control. The route middleware
// enforces it. With auth off there is no user and therefore no role, so
// filtering would leave the menu empty in the very mode meant for working
// without a backend.
const visibleItems = computed(() =>
  authEnabled ? NAVIGATION_ITEMS.filter((item) => can(item.requiredPermission)) : NAVIGATION_ITEMS,
)

// Derived from the enum, so a new group needs no change here — only its entry in
// NavigationGroup and its label. Groups with nothing visible are dropped.
const navGroups = computed<NavGroup[]>(() =>
  Object.values(NavigationGroup)
    .map((group) => ({
      label: NAVIGATION_GROUP_LABELS[group],
      items: visibleItems.value
        .filter((item) => item.group === group)
        .map((item) => ({ title: item.title, icon: item.icon, url: item.to })),
    }))
    .filter((group) => group.items.length > 0),
)

const displayUser = computed(() => ({
  name: user.value?.name ?? user.value?.email ?? 'User',
  email: user.value?.email ?? '',
  roleLabel: user.value?.role ? (ROLE_LABELS[user.value.role] ?? user.value.role) : '',
  avatar: user.value?.avatar ?? null,
}))

// The mobile sidebar is an overlay: leaving it open over the page the user just
// navigated to hides what they asked for.
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    if (isMobile.value && openMobile.value) setOpenMobile(false)
  },
)
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            size="lg"
            tooltip="Home"
            class="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"
          >
            <NuxtLink to="/">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <img :src="APP_BRANDING.logo" alt="" class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ APP_BRANDING.name }}</span>
              </div>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <NavMain :groups="navGroups" />
    </SidebarContent>

    <SidebarFooter>
      <NavUser :user="displayUser" />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
