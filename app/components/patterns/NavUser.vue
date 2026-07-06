<script setup lang="ts">
import { ChevronsUpDown, LogOut, Moon, Sun } from '@lucide/vue'
import { useSidebar } from '~/components/ui/sidebar'
import { ROLE_LABELS } from '~/config/domain'

const auth = useAuthFeature()
const colorMode = useColorMode()
const { isMobile } = useSidebar()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const roleLabel = computed(() => {
  const role = auth.user.value?.roles[0]
  return role ? ROLE_LABELS[role] : ''
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <AppAvatar
              :name="auth.user.value?.name"
              class="size-8 rounded-lg"
              fallback-class="rounded-lg"
            />
            <div class="grid flex-1 text-start text-sm leading-tight">
              <span class="truncate font-medium">{{ auth.user.value?.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ roleLabel }}</span>
            </div>
            <ChevronsUpDown class="ms-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
              <Avatar class="size-8 rounded-lg">
                <AvatarFallback class="rounded-lg">{{
                  getInitials(auth.user.value?.name)
                }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-start text-sm leading-tight">
                <span class="truncate font-medium">{{ auth.user.value?.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{
                  auth.user.value?.email
                }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="toggleColorMode">
            <Sun v-if="colorMode.value === 'dark'" class="size-4" />
            <Moon v-else class="size-4" />
            {{ colorMode.value === 'dark' ? 'Modo claro' : 'Modo oscuro' }}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <button type="button" class="w-full" @click="auth.logout">
              <LogOut />
              Cerrar sesión
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
