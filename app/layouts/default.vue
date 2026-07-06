<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex items-center gap-2 border-b bg-background px-4 py-3">
        <SidebarTrigger />
        <slot name="header" />
      </header>
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
