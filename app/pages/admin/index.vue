<script setup lang="ts">
import type { UserFormData } from '~/features/users/schemas'
import type { User } from '~/types/user'
import { PencilIcon, PlusIcon, Trash2Icon, UsersIcon } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { ROLE_LABELS } from '~/config/permissions'
import { normalizeError } from '~/core/errors'
import UserFormDialog from '~/features/users/components/UserFormDialog.vue'
import { UsersService } from '~/features/users/services/users'
import { UserRole } from '~/types/user'

useHead({ title: 'Users · Admin' })

const { accessToken } = useAuth()
const users = new UsersService(() => accessToken.value)
const list = useQuery<User[]>()

const search = ref('')
// Debounced so typing doesn't fire a request per keystroke — which is also what
// keeps overlapping runs (and their ordering) out of the picture.
const debouncedSearch = refDebounced(search, 300)

const editing = ref<User | null>(null)
const formOpen = ref(false)
const deleting = ref<User | null>(null)
const isDeleting = ref(false)

async function load() {
  await list.run(() => users.list(debouncedSearch.value))
  if (list.error) toast.error(list.error.message)
}

// The endpoints are relative to this app, so the call only makes sense from the
// browser: on the server the page has no cookies to forward to itself.
onMounted(load)
watch(debouncedSearch, load)

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(user: User) {
  editing.value = user
  formOpen.value = true
}

/** Returns whether it succeeded, so the dialog knows to close. */
async function save(data: UserFormData): Promise<boolean> {
  const target = editing.value

  try {
    if (target) await users.update(target.id, data)
    else await users.create(data)
  } catch (err) {
    toast.error(normalizeError(err).message)
    return false
  }

  toast.success(target ? 'User updated.' : 'User created.')
  await load()
  return true
}

async function confirmDelete() {
  const target = deleting.value
  if (!target) return

  isDeleting.value = true
  try {
    await users.remove(target.id)
    toast.success(`${target.email} was removed.`)
    deleting.value = null
    await load()
  } catch (err) {
    toast.error(normalizeError(err).message)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader title="Users" description="Create, edit and remove the people in this workspace.">
      <template #actions>
        <Button size="sm" @click="openCreate">
          <PlusIcon class="size-4" />
          New user
        </Button>
      </template>
    </PageHeader>

    <Input v-model="search" type="search" placeholder="Search by name or email…" class="max-w-sm" />

    <AsyncView :query="list">
      <template #default="{ data }">
        <div class="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead class="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in data" :key="user.id">
                <TableCell class="font-medium">{{ user.name ?? '—' }}</TableCell>
                <TableCell class="text-muted-foreground">{{ user.email }}</TableCell>
                <TableCell>
                  <Badge :variant="user.role === UserRole.ADMIN ? 'default' : 'secondary'">
                    {{ ROLE_LABELS[user.role] }}
                  </Badge>
                </TableCell>
                <TableCell class="text-muted-foreground">
                  {{ formatDate(user.created_at) }}
                </TableCell>
                <TableCell class="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    :aria-label="`Edit ${user.email}`"
                    @click="openEdit(user)"
                  >
                    <PencilIcon class="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    :aria-label="`Delete ${user.email}`"
                    @click="deleting = user"
                  >
                    <Trash2Icon class="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </template>

      <template #empty>
        <EmptyState
          :title="search ? 'No matches' : 'No users yet'"
          :description="
            search ? `Nothing matched “${search}”.` : 'Create the first user to get started.'
          "
        >
          <template #icon>
            <UsersIcon class="size-5" />
          </template>
          <template #action>
            <Button variant="outline" size="sm" @click="openCreate">New user</Button>
          </template>
        </EmptyState>
      </template>
    </AsyncView>

    <UserFormDialog v-if="formOpen" v-model:open="formOpen" :user="editing" :save="save" />

    <AlertDialog
      :open="deleting !== null"
      @update:open="(value: boolean) => !value && (deleting = null)"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this user?</AlertDialogTitle>
          <AlertDialogDescription>
            {{ deleting?.email }} will lose access immediately. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction :disabled="isDeleting" @click="confirmDelete">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
