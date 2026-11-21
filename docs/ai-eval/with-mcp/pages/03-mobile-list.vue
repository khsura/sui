<template>
  <SApp>
    <div class="contacts-page">
      <SSheet tag="header" class="contacts-header">
        <h1 class="contacts-title">Contacts</h1>
        <SInput
          v-model="searchQuery"
          type="search"
          inputmode="search"
          label="Search by name"
          placeholder="Search by name"
          autocomplete="off"
          hide-details
        />
      </SSheet>

      <SList v-if="filteredContacts.length" divided class="contacts-list">
        <SListItem v-for="contact in filteredContacts" :key="contact.id">
          <SListItemIcon align-center>
            <SSheet
              :color="contact.color"
              :width="AVATAR_SIZE_PX"
              :height="AVATAR_SIZE_PX"
              border-radius="50%"
              class="contact-avatar"
              aria-hidden="true"
            >
              {{ getInitials(contact.name) }}
            </SSheet>
          </SListItemIcon>

          <SListItemContent>
            <SListItemTitle>{{ contact.name }}</SListItemTitle>
            <SListItemSubtitle>{{ contact.phone }}</SListItemSubtitle>
          </SListItemContent>

          <SListItemAction align-center>
            <SMenu location="bottom" close-on-content-click>
              <template #activator="{ on, attrs }">
                <SButton
                  variant="icon"
                  :aria-label="`Actions for ${contact.name}`"
                  v-on="on"
                  v-bind="attrs"
                >
                  <SIcon icon="mdi-dots-vertical" />
                </SButton>
              </template>
              <SList dense>
                <SListItem :href="`tel:${contact.phone.replace(/\s/g, '')}`" @click="notify(`Calling ${contact.name}…`)">
                  <SListItemIcon align-center><SIcon icon="mdi-phone" /></SListItemIcon>
                  <SListItemContent><SListItemTitle>Call</SListItemTitle></SListItemContent>
                </SListItem>
                <SListItem link @click="editContact(contact)">
                  <SListItemIcon align-center><SIcon icon="mdi-pencil" /></SListItemIcon>
                  <SListItemContent><SListItemTitle>Edit</SListItemTitle></SListItemContent>
                </SListItem>
                <SListItem link @click="deleteContact(contact)">
                  <SListItemIcon align-center><SIcon icon="mdi-delete" color="error" /></SListItemIcon>
                  <SListItemContent><SListItemTitle>Delete</SListItemTitle></SListItemContent>
                </SListItem>
              </SList>
            </SMenu>
          </SListItemAction>
        </SListItem>
      </SList>

      <p v-else class="contacts-empty">No contacts match "{{ searchQuery }}".</p>
    </div>

    <SSnackbar v-model="isSnackbarOpen" :timeout="SNACKBAR_TIMEOUT_MS" location="bottom">
      {{ snackbarMessage }}
      <template #action>
        <SButton variant="text" color="primary" @click="isSnackbarOpen = false">Close</SButton>
      </template>
    </SSnackbar>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SApp,
  SButton,
  SIcon,
  SInput,
  SList,
  SListItem,
  SListItemAction,
  SListItemContent,
  SListItemIcon,
  SListItemSubtitle,
  SListItemTitle,
  SMenu,
  SSheet,
  SSnackbar,
} from '@khsura/sui'

interface Contact {
  id: number
  name: string
  phone: string
  color: string
}

const AVATAR_SIZE_PX = 40
const SNACKBAR_TIMEOUT_MS = 3000

const contacts = ref<Contact[]>([
  { id: 1, name: 'Alice Johnson', phone: '+1 555 010 2231', color: '#5C6BC0' },
  { id: 2, name: 'Brian Carter', phone: '+1 555 014 9087', color: '#26A69A' },
  { id: 3, name: 'Chloe Martinez', phone: '+1 555 019 3342', color: '#EF5350' },
  { id: 4, name: 'Daniel Kim', phone: '+1 555 012 7765', color: '#FFA726' },
  { id: 5, name: 'Emma Wilson', phone: '+1 555 017 4410', color: '#AB47BC' },
  { id: 6, name: 'Farhan Ali', phone: '+1 555 011 6628', color: '#42A5F5' },
  { id: 7, name: 'Grace Lee', phone: '+1 555 018 2209', color: '#66BB6A' },
  { id: 8, name: 'Henry Nguyen', phone: '+1 555 013 5574', color: '#8D6E63' },
  { id: 9, name: 'Isabella Rossi', phone: '+1 555 016 8813', color: '#EC407A' },
  { id: 10, name: 'Jack Thompson', phone: '+1 555 015 3096', color: '#78909C' },
])

const searchQuery = ref<string | null>('')
const isSnackbarOpen = ref(false)
const snackbarMessage = ref('')

const filteredContacts = computed(() => {
  const query = (searchQuery.value ?? '').trim().toLowerCase()
  if (!query) return contacts.value
  return contacts.value.filter((contact) => contact.name.toLowerCase().includes(query))
})

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

const notify = (message: string) => {
  snackbarMessage.value = message
  isSnackbarOpen.value = true
}

const editContact = (contact: Contact) => {
  notify(`Editing ${contact.name}`)
}

const deleteContact = (contact: Contact) => {
  contacts.value = contacts.value.filter((item) => item.id !== contact.id)
  notify(`${contact.name} deleted`)
}
</script>

<style scoped>
.contacts-page {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
}

.contacts-header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 16px 16px 12px;
}

.contacts-title {
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 600;
}

.contacts-list {
  padding: 0 8px;
}

.contact-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
}

.contacts-empty {
  padding: 32px 16px;
  text-align: center;
  opacity: 0.7;
}
</style>
