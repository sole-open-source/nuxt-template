<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description: string
    showCancel?: boolean
    confirmText?: string
    cancelText?: string
    variant?: 'destructive' | 'default'
  }>(),
  {
    showCancel: true,
    confirmText: 'Continuar',
    cancelText: 'Cancelar',
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('update:open', false)
  emit('cancel')
}
</script>

<template>
  <Dialog :open="props.open" @update:open="(value) => emit('update:open', value)">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>
      <DialogFooter class="gap-2">
        <Button v-if="showCancel" variant="secondary" @click="onCancel">{{ cancelText }}</Button>
        <Button :variant="variant" type="submit" @click="onConfirm">{{ confirmText }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
