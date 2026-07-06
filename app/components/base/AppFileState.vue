<script setup lang="ts">
import { CheckCircle, File as FileIcon, Image as ImageIcon, Loader2, Video as VideoIcon, XCircle } from '@lucide/vue'

const props = defineProps<{
  file: File
  loading: boolean
  error: string | null
}>()

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv']

const fileType = computed(() => {
  const extension = props.file.name.toLowerCase().split('.').pop() ?? ''
  if (IMAGE_EXTENSIONS.includes(extension)) return 'image'
  if (VIDEO_EXTENSIONS.includes(extension)) return 'video'
  return 'other'
})
</script>

<template>
  <div class="flex items-center gap-4 rounded-md bg-muted/40 p-3">
    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
      <ImageIcon v-if="fileType === 'image'" class="size-5 text-muted-foreground" />
      <VideoIcon v-else-if="fileType === 'video'" class="size-5 text-muted-foreground" />
      <FileIcon v-else class="size-5 text-muted-foreground" />
    </div>

    <div class="items-top flex h-full min-w-0 flex-1 flex-col">
      <p class="truncate text-sm font-medium">{{ file.name }}</p>
      <p v-if="!loading" :class="error !== null ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'">
        {{ error ?? 'Carga completa' }}
      </p>
    </div>

    <div class="shrink-0">
      <div class="flex h-8 w-8 shrink-0 items-center justify-center">
        <Loader2 v-if="loading" class="size-5 animate-spin text-muted-foreground" />
        <CheckCircle v-else-if="error === null" class="size-5 text-green-500" />
        <XCircle v-else class="size-5 text-destructive" />
      </div>
    </div>
  </div>
</template>
