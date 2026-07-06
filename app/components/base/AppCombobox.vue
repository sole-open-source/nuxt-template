<script setup lang="ts">
import { Check, ChevronsUpDown } from '@lucide/vue'
import { cn } from '~/lib/utils'

export interface AppComboboxOption {
  value: string
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options: AppComboboxOption[]
    triggerPlaceholder?: string
    searchPlaceholder?: string
    notFoundPlaceholder?: string
    disabled?: boolean
  }>(),
  {
    triggerPlaceholder: 'Selecciona una opción...',
    searchPlaceholder: 'Buscar...',
    notFoundPlaceholder: 'Sin resultados.',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const open = ref(false)

const selectedLabel = computed(() => props.options.find((option) => option.value === props.modelValue)?.label)

function select(value: string) {
  emit('update:modelValue', value)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled"
        class="flex w-full items-center justify-between"
      >
        {{ selectedLabel || triggerPlaceholder }}
        <ChevronsUpDown class="opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0">
      <Command>
        <CommandInput class="border-0 ring-0 outline-0 focus:border-0" :placeholder="searchPlaceholder" />
        <CommandList>
          <CommandEmpty>{{ notFoundPlaceholder }}</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="select(option.value)"
            >
              <Check :class="cn(modelValue !== option.value && 'text-transparent')" />
              {{ option.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
