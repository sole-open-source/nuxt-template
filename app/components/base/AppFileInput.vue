<script setup lang="ts">
import { AlertCircle, File as FileIcon, Upload, X } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    variant?: 'single' | 'multiple'
    accept?: string
    maxSize?: number
    maxFiles?: number
    disabled?: boolean
    showFiles?: boolean
  }>(),
  {
    variant: 'single',
    accept: '',
    maxSize: 5 * 1024 * 1024,
    maxFiles: 5,
    showFiles: true,
  },
)

const emit = defineEmits<{ 'update:modelValue': [files: File[]] }>()

const files = ref<File[]>([])
const error = ref<string | null>(null)
const uploadProgress = ref(0)
const fileInputRef = ref<HTMLInputElement>()

watch([files, uploadProgress], ([currentFiles, progress], _old, onCleanup) => {
  if (currentFiles.length > 0 && progress < 100) {
    const timer = setTimeout(() => {
      uploadProgress.value = Math.min(uploadProgress.value + 10, 100)
    }, 80)
    onCleanup(() => clearTimeout(timer))
  }
})

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function isValidFileType(fileType: string): boolean {
  if (!props.accept) return true
  return props.accept.split(',').some((type) => {
    if (type.endsWith('/*')) return fileType.startsWith(`${type.split('/')[0]}/`)
    return type === fileType
  })
}

function isValidFileSize(fileSize: number): boolean {
  return fileSize <= props.maxSize
}

function validateFiles(fileList: FileList): { valid: File[]; errors: string[] } {
  const valid: File[] = []
  const errors: string[] = []

  Array.from(fileList).forEach((file) => {
    if (!isValidFileType(file.type)) {
      errors.push(`El archivo "${file.name}" no es un tipo válido.`)
    } else if (!isValidFileSize(file.size)) {
      errors.push(
        `El archivo "${file.name}" supera el tamaño máximo de ${formatFileSize(props.maxSize)}.`,
      )
    } else {
      valid.push(file)
    }
  })

  return { valid, errors }
}

function handleFilesChange(next: File[]) {
  files.value = next
  emit('update:modelValue', next)
}

function handleFiles(fileList: FileList) {
  error.value = null
  const { valid, errors } = validateFiles(fileList)

  const [firstError] = errors
  if (firstError) {
    error.value = firstError
    return
  }

  const [firstValid] = valid
  if (props.variant === 'single') {
    if (firstValid) {
      uploadProgress.value = 0
      handleFilesChange([firstValid])
    }
  } else {
    uploadProgress.value = 0
    handleFilesChange([...files.value, ...valid].slice(0, props.maxFiles))
  }
}

function handleInputChange(event: Event) {
  const list = (event.target as HTMLInputElement).files
  if (list) handleFiles(list)
}

function handleClick() {
  if (!props.disabled) fileInputRef.value?.click()
}

function removeFile(index: number) {
  const next = [...files.value]
  next.splice(index, 1)
  handleFilesChange(next)
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5"
      @click="handleClick"
    >
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="variant === 'multiple'"
        :disabled="disabled"
        class="hidden"
        :aria-label="variant === 'single' ? 'Seleccionar archivo' : 'Seleccionar archivos'"
        @change="handleInputChange"
      />
      <Upload class="h-10 w-10 text-muted-foreground" />
      <div class="text-center">
        <p class="text-sm font-medium">
          Haz clic para seleccionar {{ variant === 'single' ? 'un archivo' : 'archivos' }}.
        </p>
        <p class="mt-1 text-xs text-muted-foreground">
          {{ variant === 'single' ? 'Tamaño máximo: ' : 'Tamaño máximo por archivo: '
          }}{{ formatFileSize(maxSize) }}
        </p>
        <p v-if="variant === 'multiple'" class="text-xs text-muted-foreground">
          Máximo de archivos: {{ maxFiles }}
        </p>
      </div>
    </div>

    <div v-if="error" class="flex items-center gap-2 text-sm text-destructive">
      <AlertCircle class="size-4" />
      <span>{{ error }}</span>
    </div>

    <ScrollArea v-if="files.length > 0 && showFiles" class="h-full max-h-36 w-full lg:max-h-44">
      <div class="flex w-full flex-col gap-y-2">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="flex w-full items-center justify-between rounded-lg bg-muted/40 p-3"
        >
          <div class="flex items-center gap-2 overflow-hidden">
            <FileIcon class="size-5 shrink-0 text-muted-foreground" />
            <div class="max-w-52 min-w-0">
              <p class="truncate text-sm font-medium">{{ file.name }}</p>
              <p class="text-xs text-muted-foreground">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="h-8 w-8 shrink-0"
            @click.stop="removeFile(index)"
          >
            <X class="size-4" />
            <span class="sr-only">Quitar archivo</span>
          </Button>
        </div>
      </div>
    </ScrollArea>

    <div v-if="uploadProgress > 0 && uploadProgress < 100" class="space-y-1">
      <div class="flex justify-between text-xs">
        <span>Subiendo...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <Progress :model-value="uploadProgress" class="h-2" />
    </div>
  </div>
</template>
