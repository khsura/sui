<template>
  <SApp>
    <div class="file-manager">
      <SCard>
        <SCardTitle>Files</SCardTitle>
        <SCardText>
          <SList v-if="files.length" divided>
            <SListItem v-for="file in files" :key="file.id">
              <SListItemIcon align-center>
                <SIcon icon="mdi-file-outline" />
              </SListItemIcon>
              <SListItemContent>
                <SListItemTitle>{{ file.name }}</SListItemTitle>
                <SListItemSubtitle>
                  {{ formatSize(file.size) }} · Modified {{ formatDate(file.modified) }}
                </SListItemSubtitle>
              </SListItemContent>
              <SListItemAction align-center>
                <SButton variant="text" color="primary" @click="openRename(file)">
                  Rename
                </SButton>
                <SButton variant="text" color="error" @click="deleteFile(file)">
                  Delete
                </SButton>
              </SListItemAction>
            </SListItem>
          </SList>
          <p v-else class="empty">No files.</p>
        </SCardText>
      </SCard>
    </div>

    <SDialog v-model="renameOpen" :max-width="420">
      <SCard>
        <SCardTitle>Rename file</SCardTitle>
        <SCardText>
          <SForm ref="renameFormRef" @submit.prevent="saveRename">
            <SInput v-model="renameValue" label="File name" :rules="[requiredName]" />
          </SForm>
        </SCardText>
        <SCardActions>
          <SSpacer />
          <SButton variant="text" @click="renameOpen = false">Cancel</SButton>
          <SButton color="primary" @click="saveRename">Save</SButton>
        </SCardActions>
      </SCard>
    </SDialog>

    <SSnackbar v-model="deletedSnackbar" :timeout="SNACKBAR_TIMEOUT">
      File deleted
      <template #action>
        <SButton variant="text" color="primary" @click="undoDelete">Undo</SButton>
      </template>
    </SSnackbar>

    <SSnackbar v-model="renamedSnackbar" :timeout="SNACKBAR_TIMEOUT">
      <SIcon icon="mdi-check-circle" color="success" />
      Renamed
    </SSnackbar>
  </SApp>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import {
  SApp,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SDialog,
  SForm,
  SIcon,
  SInput,
  SList,
  SListItem,
  SListItemAction,
  SListItemContent,
  SListItemIcon,
  SListItemSubtitle,
  SListItemTitle,
  SSnackbar,
  SSpacer,
} from '@khsura/sui'

interface FileEntry {
  id: number
  name: string
  size: number
  modified: string
}

interface DeletedEntry {
  file: FileEntry
  index: number
}

const SNACKBAR_TIMEOUT = 4000
const BYTES_PER_KB = 1024
const SIZE_UNITS = ['B', 'KB', 'MB', 'GB']

const files = ref<FileEntry[]>([
  { id: 1, name: 'Quarterly report.pdf', size: 2_457_600, modified: '2026-11-18T10:24:00' },
  { id: 2, name: 'Team photo.jpg', size: 4_812_390, modified: '2026-11-15T16:02:00' },
  { id: 3, name: 'Budget 2027.xlsx', size: 186_420, modified: '2026-11-12T09:41:00' },
  { id: 4, name: 'Meeting notes.txt', size: 3_208, modified: '2026-11-10T14:15:00' },
  { id: 5, name: 'Product demo.mp4', size: 128_450_000, modified: '2026-11-02T11:30:00' },
])

const formatSize = (bytes: number): string => {
  let value = bytes
  let unitIndex = 0
  while (value >= BYTES_PER_KB && unitIndex < SIZE_UNITS.length - 1) {
    value /= BYTES_PER_KB
    unitIndex++
  }
  return `${unitIndex === 0 ? value : value.toFixed(1)} ${SIZE_UNITS[unitIndex]}`
}

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

// Restart a snackbar's timeout when it is already visible: SSnackbar restarts
// its timer each time v-model turns true.
const showSnackbar = async (target: { value: boolean }) => {
  if (target.value) {
    target.value = false
    await nextTick()
  }
  target.value = true
}

// Delete + undo
const deletedSnackbar = ref(false)
const lastDeleted = ref<DeletedEntry | null>(null)

const deleteFile = (file: FileEntry) => {
  const index = files.value.findIndex((entry) => entry.id === file.id)
  if (index === -1) return
  files.value.splice(index, 1)
  lastDeleted.value = { file, index }
  showSnackbar(deletedSnackbar)
}

const undoDelete = () => {
  const deleted = lastDeleted.value
  if (deleted) {
    files.value.splice(Math.min(deleted.index, files.value.length), 0, deleted.file)
    lastDeleted.value = null
  }
  deletedSnackbar.value = false
}

// Rename
const renameOpen = ref(false)
const renameValue = ref('')
const renamingId = ref<number | null>(null)
const renamedSnackbar = ref(false)
const renameFormRef = ref<InstanceType<typeof SForm> | null>(null)

const requiredName = (value: unknown): true | string =>
  (typeof value === 'string' && value.trim().length > 0) || 'File name is required'

const openRename = (file: FileEntry) => {
  renamingId.value = file.id
  renameValue.value = file.name
  renameFormRef.value?.resetValidation()
  renameOpen.value = true
}

const saveRename = () => {
  const hasErrors = renameFormRef.value?.validate()
  if (hasErrors) return
  const file = files.value.find((entry) => entry.id === renamingId.value)
  if (file) {
    file.name = renameValue.value.trim()
    file.modified = new Date().toISOString()
  }
  renameOpen.value = false
  showSnackbar(renamedSnackbar)
}
</script>

<style scoped>
.file-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.empty {
  text-align: center;
  opacity: 0.7;
}
</style>
