<script setup lang="ts">
export interface AppSelectOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options: AppSelectOption[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Selecciona una opción...',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const triggerLabel = computed(
  () =>
    props.options.find((option) => option.value === props.modelValue)?.label ?? props.placeholder,
)
</script>

<template>
  <Select v-model="model" :disabled="disabled">
    <SelectTrigger class="w-full">
      <slot :label="triggerLabel">{{ triggerLabel }}</slot>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
