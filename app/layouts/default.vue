<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <SiteHeader />
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
