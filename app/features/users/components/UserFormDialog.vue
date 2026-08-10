<script setup lang="ts">
import type { UserFormData } from '~/features/users/schemas'
import type { User } from '~/types/user'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ROLE_LABELS } from '~/config/permissions'
import { UserFormSchema } from '~/features/users/schemas'
import { UserRole } from '~/types/user'

const props = defineProps<{
  /** Null creates, a user edits. */
  user?: User | null
  /** Returns whether it succeeded, so the dialog knows to close. */
  save: (data: UserFormData) => Promise<boolean>
}>()

const open = defineModel<boolean>('open', { required: true })

const roles = Object.values(UserRole)

// Read once on purpose: the parent mounts this only while open, so `user` never
// changes during its lifetime and these defaults are always fresh. That is also
// why nothing watches the prop to refill the fields.
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(UserFormSchema),
  initialValues: {
    name: props.user?.name ?? '',
    email: props.user?.email ?? '',
    role: props.user?.role ?? UserRole.MEMBER,
  },
})

const onSubmit = handleSubmit(async (values) => {
  if (await props.save(values)) open.value = false
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ user ? 'Edit user' : 'New user' }}</DialogTitle>
        <DialogDescription>
          {{ user ? `Update the details for ${user.email}.` : 'Add a new user to the workspace.' }}
        </DialogDescription>
      </DialogHeader>

      <form class="grid gap-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Ada Lovelace" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="role">
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role" :value="role">
                  {{ ROLE_LABELS[role] }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">Cancel</Button>
          <Button type="submit" :disabled="isSubmitting">
            {{ user ? 'Save changes' : 'Create user' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
