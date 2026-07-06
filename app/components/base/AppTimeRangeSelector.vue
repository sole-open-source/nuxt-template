<script setup lang="ts">
import { Calendar as CalendarIcon } from '@lucide/vue'
import type { TimeFilter } from '~/utils/date'

const props = defineProps<{
  modelValue: TimeFilter
  options: TimeFilter[]
  disabled?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: TimeFilter] }>()

const selectOptions = computed(() => {
  const values = props.options.includes(props.modelValue)
    ? props.options
    : [props.modelValue, ...props.options]
  return values.map((option) => ({ label: timeFilterLabel(option), value: option }))
})

function onUpdate(value: string) {
  emit('update:modelValue', value as TimeFilter)
}
</script>

<template>
  <AppSelect
    :model-value="modelValue"
    :options="selectOptions"
    :disabled="disabled"
    @update:model-value="onUpdate"
  >
    <template #default="{ label }">
      <div class="flex w-full items-center gap-2">
        <CalendarIcon class="size-4" />
        <span>{{ label }}</span>
      </div>
    </template>
  </AppSelect>
</template>
