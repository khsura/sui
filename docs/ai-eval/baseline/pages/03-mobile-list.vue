<template>
  <SApp>
    <SLayout name="app">
      <SAppBar for="app" position="fixed" color="primary">
        <SAppBarTitle>Contacts</SAppBarTitle>
        <SSpacer />
        <span class="contacts-count">{{ filteredContacts.length }}</span>
      </SAppBar>

      <SMain for="app">
        <div class="contacts-page">
          <div class="contacts-search">
            <SInput
              v-model="searchQuery"
              label="Search contacts"
              placeholder="Type a name"
              type="search"
              inputmode="search"
              autocomplete="off"
              hide-error
            />
          </div>

          <p v-if="statusMessage" class="contacts-status" role="status">
            {{ statusMessage }}
          </p>

          <SList v-if="filteredContacts.length" divided class="contacts-list">
            <SListItem v-for="contact in filteredContacts" :key="contact.id">
              <SListItemIcon align-center>
                <div class="contact-avatar">
                  <SImage
                    :src="contact.avatar"
                    :alt="contact.name"
                    :aspect-ratio="1"
                    :width="AVATAR_SIZE"
                    object-fit="cover"
                  />
                </div>
              </SListItemIcon>

              <SListItemContent>
                <SListItemTitle>{{ contact.name }}</SListItemTitle>
                <SListItemSubtitle>{{ contact.phone }}</SListItemSubtitle>
              </SListItemContent>

              <SListItemAction align-center>
                <SMenu
                  location="bottom left"
                  close-on-content-click
                  :min-width="MENU_MIN_WIDTH"
                  :screen-padding="MENU_SCREEN_PADDING"
                >
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

                  <SList dense link>
                    <SListItem @click="callContact(contact)">
                      <SListItemIcon align-center>
                        <SIcon icon="mdi-phone" />
                      </SListItemIcon>
                      <SListItemContent>
                        <SListItemTitle>Call</SListItemTitle>
                      </SListItemContent>
                    </SListItem>
                    <SListItem @click="editContact(contact)">
                      <SListItemIcon align-center>
                        <SIcon icon="mdi-pencil" />
                      </SListItemIcon>
                      <SListItemContent>
                        <SListItemTitle>Edit</SListItemTitle>
                      </SListItemContent>
                    </SListItem>
                    <SListItem @click="deleteContact(contact)">
                      <SListItemIcon align-center>
                        <SIcon icon="mdi-delete" color="error" />
                      </SListItemIcon>
                      <SListItemContent>
                        <SListItemTitle>
                          <span class="contact-delete">Delete</span>
                        </SListItemTitle>
                      </SListItemContent>
                    </SListItem>
                  </SList>
                </SMenu>
              </SListItemAction>
            </SListItem>
          </SList>

          <div v-else class="contacts-empty">
            <SIcon icon="mdi-account-search" size="large" />
            <p>No contacts match "{{ searchQuery }}"</p>
          </div>
        </div>
      </SMain>
    </SLayout>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SApp,
  SLayout,
  SAppBar,
  SAppBarTitle,
  SSpacer,
  SMain,
  SInput,
  SList,
  SListItem,
  SListItemIcon,
  SListItemContent,
  SListItemTitle,
  SListItemSubtitle,
  SListItemAction,
  SImage,
  SMenu,
  SButton,
  SIcon,
} from '@khsura/sui'

interface Contact {
  id: number
  name: string
  phone: string
  avatar: string
}

const AVATAR_SIZE = 40
const MENU_MIN_WIDTH = 160
const MENU_SCREEN_PADDING = 16

const contacts = ref<Contact[]>([
  { id: 1, name: 'Alice Johnson', phone: '+1 (555) 201-3344', avatar: 'https://i.pravatar.cc/80?img=1' },
  { id: 2, name: 'Brian Lee', phone: '+1 (555) 482-1290', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 3, name: 'Carla Mendes', phone: '+1 (555) 330-7781', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 4, name: 'David Kim', phone: '+1 (555) 619-4402', avatar: 'https://i.pravatar.cc/80?img=13' },
  { id: 5, name: 'Emma Wilson', phone: '+1 (555) 774-0918', avatar: 'https://i.pravatar.cc/80?img=9' },
  { id: 6, name: 'Farhan Ahmed', phone: '+1 (555) 145-6623', avatar: 'https://i.pravatar.cc/80?img=15' },
  { id: 7, name: 'Grace Chen', phone: '+1 (555) 902-3357', avatar: 'https://i.pravatar.cc/80?img=10' },
  { id: 8, name: 'Hugo Martin', phone: '+1 (555) 268-8840', avatar: 'https://i.pravatar.cc/80?img=33' },
  { id: 9, name: 'Isla Novak', phone: '+1 (555) 517-2209', avatar: 'https://i.pravatar.cc/80?img=20' },
  { id: 10, name: 'Jamal Brooks', phone: '+1 (555) 836-1175', avatar: 'https://i.pravatar.cc/80?img=53' },
])

const searchQuery = ref<string | number | null>('')
const statusMessage = ref('')

const filteredContacts = computed(() => {
  const query = String(searchQuery.value ?? '').trim().toLowerCase()
  if (!query) return contacts.value
  return contacts.value.filter((contact) => contact.name.toLowerCase().includes(query))
})

const callContact = (contact: Contact) => {
  statusMessage.value = `Calling ${contact.name}…`
  window.location.href = `tel:${contact.phone.replace(/[^\d+]/g, '')}`
}

const editContact = (contact: Contact) => {
  statusMessage.value = `Editing ${contact.name}`
}

const deleteContact = (contact: Contact) => {
  contacts.value = contacts.value.filter((item) => item.id !== contact.id)
  statusMessage.value = `${contact.name} deleted`
}
</script>

<style scoped>
.contacts-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 12px 16px 24px;
}

.contacts-search {
  margin-bottom: 8px;
}

.contacts-count {
  font-size: 14px;
  opacity: 0.85;
}

.contacts-status {
  margin: 0 0 8px;
  font-size: 13px;
  opacity: 0.75;
}

.contacts-list {
  border-radius: 12px;
  overflow: hidden;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
}

.contact-delete {
  color: var(--s-color-error, #d32f2f);
}

.contacts-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 16px;
  text-align: center;
  opacity: 0.7;
}
</style>
