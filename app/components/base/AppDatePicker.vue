<script setup lang="ts">
import { Calendar as CalendarIcon } from '@lucide/vue'
import { DateFormatter, type DateValue, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const df = new DateFormatter('es', { dateStyle: 'long' })

const internalValue = computed<DateValue | undefined>(() => {
  if (props.modelValue && isValidDate(props.modelValue)) {
    try {
      return parseDate(props.modelValue)
    } catch {
      return undefined
    }
  }
  return undefined
})

function onValueChange(value: DateValue | undefined) {
  emit('update:modelValue', value?.toString() ?? '')
}
</script>

<template>
  <Popover>
    <PopoverTrigger :disabled="disabled" as-child>
      <Button
        :disabled="disabled"
        variant="outline"
        :class="cn('w-full justify-start text-left font-normal', !internalValue && 'text-muted-foreground', props.class)"
      >
        <CalendarIcon class="mr-2 size-4" />
        {{ internalValue ? df.format(internalValue.toDate(getLocalTimeZone())) : 'Selecciona una fecha' }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar :model-value="internalValue" type="single" @update:model-value="onValueChange" />
    </PopoverContent>
  </Popover>
</template>
