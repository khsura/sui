<template>
  <SRow align="center" :gap="12" class="s_pa__4">
    <SDialog v-model="isDialogOpen" :max-width="420">
      <template #activator="{ on, attrs }">
        <SButton color="primary" v-on="on" v-bind="attrs">Delete project</SButton>
      </template>
      <SCard>
        <SCardTitle>Delete project?</SCardTitle>
        <SCardText>This removes the project and all of its files. You cannot undo this.</SCardText>
        <SCardActions>
          <SSpacer />
          <SButton variant="text" @click="isDialogOpen = false">Cancel</SButton>
          <SButton color="error" @click="confirmDelete">Delete</SButton>
        </SCardActions>
      </SCard>
    </SDialog>

    <SMenu location="bottom" close-on-content-click>
      <template #activator="{ on, attrs }">
        <SButton outlined v-on="on" v-bind="attrs">Sort by</SButton>
      </template>
      <SList>
        <SListItem v-for="option in sortOptions" :key="option" link @click="sortBy = option">
          <SListItemContent>{{ option }}</SListItemContent>
        </SListItem>
      </SList>
    </SMenu>

    <STooltip location="top">
      <template #activator>
        <SButton variant="icon" aria-label="Help">
          <SIcon icon="mdi-help-circle-outline" />
        </SButton>
      </template>
      Sorted by {{ sortBy }}
    </STooltip>

    <SSnackbar v-model="isSnackbarOpen" :timeout="SNACKBAR_TIMEOUT_MS">
      Project deleted.
      <template #action>
        <SButton variant="text" color="primary" @click="isSnackbarOpen = false">Close</SButton>
      </template>
    </SSnackbar>
  </SRow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SDialog,
  SIcon,
  SList,
  SListItem,
  SListItemContent,
  SMenu,
  SRow,
  SSnackbar,
  SSpacer,
  STooltip,
} from '@khsura/sui'

const SNACKBAR_TIMEOUT_MS = 4000
const sortOptions = ['Name', 'Last modified', 'Size']
const isDialogOpen = ref(false)
const isSnackbarOpen = ref(false)
const sortBy = ref('Name')

const confirmDelete = () => {
  isDialogOpen.value = false
  isSnackbarOpen.value = true
}
</script>
