<script setup lang="ts">
import { ActivityIcon, InboxIcon, LayoutDashboardIcon, UsersIcon } from '@lucide/vue'
import { toast } from 'vue-sonner'

const items = useQuery<string[]>()

// The toast goes here, not inside `run`: core knows nothing about the UI, and
// only the caller knows whether this particular failure is worth interrupting for.
async function load(fail = false) {
  await items.run(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (fail) throw new Error('The demo endpoint is unreachable.')
    return ['Item A', 'Item B', 'Item C']
  })

  if (items.error) toast.error(items.error.message)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Dashboard" description="Welcome to your app. Start building here.">
      <template #actions>
        <Button variant="outline" size="sm" @click="load(true)">Simulate failure</Button>
        <Button size="sm" @click="load()">Load demo data</Button>
      </template>
    </PageHeader>

    <!-- Stat cards -->
    <section class="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total users</CardTitle>
          <UsersIcon class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,024</div>
          <p class="text-xs text-muted-foreground">All registered accounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Active sessions</CardTitle>
          <ActivityIcon class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">47</div>
          <p class="text-xs text-muted-foreground">Currently online</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Events today</CardTitle>
          <LayoutDashboardIcon class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">312</div>
          <p class="text-xs text-muted-foreground">Across all sources</p>
        </CardContent>
      </Card>
    </section>

    <!-- AsyncView + EmptyState demo -->
    <section>
      <h2 class="mb-3 text-sm font-medium text-muted-foreground">AsyncView demo</h2>

      <AsyncView :query="items">
        <template #default="{ data }">
          <ul class="divide-y rounded-lg border">
            <li v-for="item in data" :key="item" class="px-4 py-3 text-sm">{{ item }}</li>
          </ul>
        </template>

        <template #empty>
          <EmptyState
            title="No items yet"
            description="Click 'Load demo data' to see the AsyncView pattern in action."
          >
            <template #icon>
              <InboxIcon class="size-5" />
            </template>
            <template #action>
              <Button variant="outline" size="sm" @click="load()">Load demo data</Button>
            </template>
          </EmptyState>
        </template>
      </AsyncView>
    </section>
  </div>
</template>
