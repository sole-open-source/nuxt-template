<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()

defineSlots<{
  default: () => unknown
  icon?: () => unknown
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <slot name="icon" />
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ description }}</CardDescription>
    </CardHeader>

    <slot />
  </Card>
</template>
