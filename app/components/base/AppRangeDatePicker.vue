<script setup lang="ts">
import { Calendar as CalendarIcon } from '@lucide/vue'
import { DateFormatter, type CalendarDate, getLocalTimeZone } from '@internationalized/date'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

const props = defineProps<{
  modelValue?: { start?: CalendarDate; end?: CalendarDate }
}>()

const emit = defineEmits<{
  'update:modelValue': [value: { start?: CalendarDate; end?: CalendarDate }]
}>()

const df = new DateFormatter('es', { dateStyle: 'medium' })

const internalValue = computed({
  get: () => ({ start: props.modelValue?.start, end: props.modelValue?.end }),
  set: (value: { start?: CalendarDate; end?: CalendarDate }) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="grid gap-2">
    <Popover>
      <PopoverTrigger
        :class="
          cn(
            buttonVariants({ variant: 'outline' }),
            !modelValue?.start && 'max-w-max text-muted-foreground',
          )
        "
      >
        <CalendarIcon class="mr-2 size-4" />
        <template v-if="modelValue?.start">
          <template v-if="modelValue.end">
            {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
          </template>
          <template v-else>{{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}</template>
        </template>
        <template v-else>Selecciona un rango</template>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <RangeCalendar v-model="internalValue" :number-of-months="2" />
      </PopoverContent>
    </Popover>
  </div>
</template>
