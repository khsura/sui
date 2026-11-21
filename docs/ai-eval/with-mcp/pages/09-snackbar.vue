<template>
  <SApp>
    <div class="file-manager">
      <SCard>
        <SCardTitle>Files</SCardTitle>
        <SCardText>
          <SList v-if="files.length" divided>
            <SListItem v-for="file in files" :key="file.id">
              <SListItemContent>
                <SListItemTitle>{{ file.name }}</SListItemTitle>
                <SListItemSubtitle>
                  {{ formatSize(file.sizeBytes) }} · Modified {{ formatDate(file.modifiedAt) }}
                </SListItemSubtitle>
              </SListItemContent>
              <SListItemAction align-center>
                <SButton variant="text" color="primary" @click="openRename(file)">Rename</SButton>
                <SButton variant="text" color="error" @click="deleteFile(file)">Delete</SButton>
              </SListItemAction>
            </SListItem>
          </SList>
          <p v-else>No files.</p>
        </SCardText>
      </SCard>
    </div>

    <SDialog v-model="isRenameOpen" :max-width="420">
      <SCard>
        <SForm @submit.prevent="saveRename">
          <SCardTitle>Rename file</SCardTitle>
          <SCardText>
            <SInput
              id="rename-file-name"
              v-model="renameValue"
              label="File name"
              autofocus
              :rules="[requiredRule]"
            />
          </SCardText>
          <SCardActions>
            <SSpacer />
            <SButton variant="text" @click="isRenameOpen = false">Cancel</SButton>
            <SButton type="submit" color="primary" :disabled="!renameValue.trim()">Save</SButton>
          </SCardActions>
        </SForm>
      </SCard>
    </SDialog>

    <SSnackbar v-model="isDeletedSnackbarOpen" :timeout="SNACKBAR_TIMEOUT_MS">
      File deleted
      <template #action>
        <SButton variant="text" color="primary" @click="undoDelete">Undo</SButton>
      </template>
    </SSnackbar>

    <SSnackbar v-model="isRenamedSnackbarOpen" :timeout="SNACKBAR_TIMEOUT_MS">
      Renamed
      <template #action>
        <SButton variant="text" color="success" @click="isRenamedSnackbarOpen = false">Close</SButton>
      </template>
    </SSnackbar>
  </SApp>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'

interface FileEntry {
  id: number
  name: string
  sizeBytes: number
  modifiedAt: string
}

interface DeletedEntry {
  file: FileEntry
  index: number
}

const SNACKBAR_TIMEOUT_MS = 4000
const BYTES_PER_KB = 1024
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB']

const files = ref<FileEntry[]>([
  { id: 1, name: 'Quarterly report.pdf', sizeBytes: 2_457_600, modifiedAt: '2026-11-18T09:24:00' },
  { id: 2, name: 'Team photo.jpg', sizeBytes: 4_194_304, modifiedAt: '2026-11-15T16:02:00' },
  { id: 3, name: 'Budget 2027.xlsx', sizeBytes: 86_016, modifiedAt: '2026-11-12T11:45:00' },
  { id: 4, name: 'Meeting notes.txt', sizeBytes: 3_200, modifiedAt: '2026-11-10T14:30:00' },
  { id: 5, name: 'Product demo.mp4', sizeBytes: 157_286_400, modifiedAt: '2026-11-02T08:10:00' },
])

const isRenameOpen = ref(false)
const renameValue = ref('')
const renamingId = ref<number | null>(null)

const isDeletedSnackbarOpen = ref(false)
const isRenamedSnackbarOpen = ref(false)
const lastDeleted = ref<DeletedEntry | null>(null)

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

const formatSize = (bytes: number) => {
  let size = bytes
  let unitIndex = 0
  while (size >= BYTES_PER_KB && unitIndex < SIZE_UNITS.length - 1) {
    size /= BYTES_PER_KB
    unitIndex++
  }
  return `${unitIndex === 0 ? size : size.toFixed(1)} ${SIZE_UNITS[unitIndex]}`
}

const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

const requiredRule = (value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Name is required'

// Close first, then reopen on the next tick so the 4s timeout restarts for a repeated action.
const showSnackbar = async (snackbar: typeof isDeletedSnackbarOpen) => {
  snackbar.value = false
  await nextTick()
  snackbar.value = true
}

const deleteFile = (file: FileEntry) => {
  const index = files.value.findIndex((entry) => entry.id === file.id)
  if (index === -1) return
  files.value.splice(index, 1)
  lastDeleted.value = { file, index }
  isRenamedSnackbarOpen.value = false
  showSnackbar(isDeletedSnackbarOpen)
}

const undoDelete = () => {
  if (lastDeleted.value) {
    const { file, index } = lastDeleted.value
    files.value.splice(Math.min(index, files.value.length), 0, file)
    lastDeleted.value = null
  }
  isDeletedSnackbarOpen.value = false
}

const openRename = (file: FileEntry) => {
  renamingId.value = file.id
  renameValue.value = file.name
  isRenameOpen.value = true
}

const saveRename = () => {
  const newName = renameValue.value.trim()
  if (!newName) return
  const target = files.value.find((entry) => entry.id === renamingId.value)
  if (target) {
    target.name = newName
    target.modifiedAt = new Date().toISOString()
  }
  isRenameOpen.value = false
  isDeletedSnackbarOpen.value = false
  showSnackbar(isRenamedSnackbarOpen)
}
</script>

<style scoped>
.file-manager {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 16px;
}
</style>
