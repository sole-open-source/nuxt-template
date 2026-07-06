<script setup lang="ts">
import { Minus, Plus } from '@lucide/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    class?: HTMLAttributes['class']
    placeholder?: string
    min?: number
    max?: number
    step?: number
  }>(),
  {
    min: 0,
    max: Infinity,
    step: 1,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const isDecrementDisabled = computed(() =>
  typeof props.modelValue !== 'number' ? false : props.modelValue <= props.min,
)
const isIncrementDisabled = computed(() =>
  typeof props.modelValue !== 'number' ? false : props.modelValue >= props.max,
)

function setValue(value: number) {
  emit('update:modelValue', value)
}

function increment() {
  const current = typeof props.modelValue === 'number' ? props.modelValue : 0
  setValue(Math.min(props.max, current + props.step))
}

function decrement() {
  const current = typeof props.modelValue === 'number' ? props.modelValue : 0
  setValue(Math.max(props.min, current - props.step))
}

function onInputChange(event: Event) {
  setValue(Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <ButtonGroup>
    <Button
      variant="outline"
      size="icon-sm"
      type="button"
      aria-label="Disminuir"
      :disabled="isDecrementDisabled"
      @click="decrement"
    >
      <Minus />
    </Button>

    <Input
      :model-value="modelValue"
      type="number"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :class="
        cn(
          'h-8 w-14 [appearance:textfield] text-center font-mono [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          props.class,
        )
      "
      @change="onInputChange"
    />

    <Button
      variant="outline"
      size="icon-sm"
      type="button"
      aria-label="Aumentar"
      :disabled="isIncrementDisabled"
      @click="increment"
    >
      <Plus />
    </Button>
  </ButtonGroup>
</template>
