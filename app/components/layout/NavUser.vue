<script setup lang="ts">
import { ChevronsUpDownIcon, LogOutIcon, MoonIcon, SunIcon } from '@lucide/vue'
import { useSidebar } from '~/components/ui/sidebar'

defineProps<{
  user: { name: string; email: string; roleLabel: string; avatar?: string | null }
}>()

const { isMobile } = useSidebar()
const colorMode = useColorMode()
const { signOut } = useAuth()

const isDark = computed(() => colorMode.value === 'dark')

function toggleMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
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
            <Avatar class="size-8 rounded-lg">
              <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg">{{ getInitials(user.name) }}</AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ user.roleLabel }}</span>
            </div>
            <ChevronsUpDownIcon class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="size-8 rounded-lg">
                <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg">{{ getInitials(user.name) }}</AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ user.name }}</span>
                <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem @select="toggleMode">
            <SunIcon v-if="isDark" class="size-4" />
            <MoonIcon v-else class="size-4" />
            {{ isDark ? 'Light mode' : 'Dark mode' }}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem @select="signOut">
            <LogOutIcon class="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
