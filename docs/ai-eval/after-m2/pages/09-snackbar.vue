<template>
  <SApp>
    <SContainer>
      <h1>Files</h1>

      <STable :headers="headers" :items="files" item-key="id" outlined no-data-text="No files">
        <template #item.size="{ item }">{{ formatSize(item.size) }}</template>
        <template #item.modifiedAt="{ item }">{{ formatDate(item.modifiedAt) }}</template>
        <template #item.actions="{ item }">
          <SRow justify="end" :gap="4">
            <SButton variant="text" color="primary" size="small" @click="openRename(item)">
              Rename
            </SButton>
            <SButton variant="text" color="error" size="small" @click="deleteFile(item)">
              Delete
            </SButton>
          </SRow>
        </template>
      </STable>

      <SDialog v-model="isRenameOpen" :max-width="420">
        <SCard>
          <SForm ref="renameFormRef" v-model:error="hasRenameErrors" novalidate @submit.prevent="saveRename">
            <SCardTitle>Rename file</SCardTitle>
            <SCardText>
              <SInput v-model="renameValue" label="File name" autofocus :rules="[requiredRule]" />
            </SCardText>
            <SCardActions>
              <SSpacer />
              <SButton variant="text" @click="isRenameOpen = false">Cancel</SButton>
              <SButton
                type="submit"
                color="primary"
                :disabled="renameSubmitAttempted && hasRenameErrors"
              >
                Save
              </SButton>
            </SCardActions>
          </SForm>
        </SCard>
      </SDialog>

      <!-- One snackbar at the bottom: SUI snackbars at the same location overlap. -->
      <SSnackbar v-model="isSnackbarOpen" :timeout="SNACKBAR_TIMEOUT_MS">
        <SRow align="center" :gap="8">
          <SIcon v-if="snackbarKind === 'success'" icon="mdi-check-circle" color="success" />
          <span>{{ snackbarMessage }}</span>
        </SRow>
        <template #action>
          <SButton v-if="snackbarKind === 'undo'" variant="text" color="warning" @click="undoDelete">
            Undo
          </SButton>
          <SButton variant="icon" color="#ffffff" aria-label="Close" @click="isSnackbarOpen = false">
            <SIcon icon="mdi-close" />
          </SButton>
        </template>
      </SSnackbar>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { SForm, type TableHeader } from '@khsura/sui'

interface FileEntry {
  id: number
  name: string
  size: number
  modifiedAt: string
}

interface DeletedFile {
  file: FileEntry
  index: number
}

type SnackbarKind = 'undo' | 'success'

const SNACKBAR_TIMEOUT_MS = 4000
const BYTES_PER_UNIT = 1024
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB']
const SIZE_FRACTION_DIGITS = 1

const headers: TableHeader[] = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Size', value: 'size', sortable: true, align: 'end' },
  { text: 'Modified', value: 'modifiedAt', sortable: true },
  { text: '', value: 'actions', align: 'end' },
]

const files = ref<FileEntry[]>([
  { id: 1, name: 'Quarterly report.pdf', size: 2_457_600, modifiedAt: '2026-11-18T09:24:00' },
  { id: 2, name: 'Budget 2027.xlsx', size: 184_320, modifiedAt: '2026-11-15T14:02:00' },
  { id: 3, name: 'Team photo.jpg', size: 5_872_025, modifiedAt: '2026-11-10T17:45:00' },
  { id: 4, name: 'Meeting notes.docx', size: 38_912, modifiedAt: '2026-11-08T11:10:00' },
  { id: 5, name: 'Logo.svg', size: 6_144, modifiedAt: '2026-10-29T08:30:00' },
  { id: 6, name: 'Product demo.mp4', size: 154_140_672, modifiedAt: '2026-10-21T16:55:00' },
])

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })
const formatDate = (isoDate: string) => dateFormatter.format(new Date(isoDate))

const formatSize = (bytes: number) => {
  let size = bytes
  let unitIndex = 0
  while (size >= BYTES_PER_UNIT && unitIndex < SIZE_UNITS.length - 1) {
    size /= BYTES_PER_UNIT
    unitIndex += 1
  }
  const digits = unitIndex === 0 ? 0 : SIZE_FRACTION_DIGITS
  return `${size.toFixed(digits)} ${SIZE_UNITS[unitIndex]}`
}

// Snackbar
const isSnackbarOpen = ref(false)
const snackbarMessage = ref('')
const snackbarKind = ref<SnackbarKind>('success')

// The timeout restarts each time v-model becomes true, so close first when a snackbar is already showing.
const showSnackbar = async (message: string, kind: SnackbarKind) => {
  if (isSnackbarOpen.value) {
    isSnackbarOpen.value = false
    await nextTick()
  }
  snackbarMessage.value = message
  snackbarKind.value = kind
  isSnackbarOpen.value = true
}

// Delete + undo
const lastDeleted = ref<DeletedFile | null>(null)

const deleteFile = (file: FileEntry) => {
  const index = files.value.findIndex((entry) => entry.id === file.id)
  if (index === -1) return
  files.value.splice(index, 1)
  lastDeleted.value = { file, index }
  showSnackbar('File deleted', 'undo')
}

const undoDelete = () => {
  const deleted = lastDeleted.value
  if (deleted) {
    files.value.splice(Math.min(deleted.index, files.value.length), 0, deleted.file)
    lastDeleted.value = null
  }
  isSnackbarOpen.value = false
}

// Rename
const isRenameOpen = ref(false)
const renameTargetId = ref<number | null>(null)
const renameValue = ref('')
const renameFormRef = ref<InstanceType<typeof SForm> | null>(null)
// Kept in sync by SForm (v-model:error): true while any field shows an error.
const hasRenameErrors = ref(false)
const renameSubmitAttempted = ref(false)

const requiredRule = (value: unknown) => String(value ?? '').trim().length > 0 || 'File name is required'

const openRename = (file: FileEntry) => {
  renameTargetId.value = file.id
  renameValue.value = file.name
  renameSubmitAttempted.value = false
  hasRenameErrors.value = false
  isRenameOpen.value = true
}

const saveRename = () => {
  renameSubmitAttempted.value = true
  // validate() returns true when the form HAS errors.
  const hasErrors = renameFormRef.value?.validate() ?? false
  if (hasErrors) return
  const target = files.value.find((entry) => entry.id === renameTargetId.value)
  if (target) {
    target.name = renameValue.value.trim()
    target.modifiedAt = new Date().toISOString()
  }
  isRenameOpen.value = false
  showSnackbar('Renamed', 'success')
}
</script>
