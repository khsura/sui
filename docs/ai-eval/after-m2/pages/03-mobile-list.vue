<template>
  <SApp>
    <main class="contacts s_mx__auto s_px__4 s_py__4">
      <header class="s_mb__3">
        <h1 class="s_text--h5 s_ma__0">Contacts</h1>
        <p class="s_text--body__2 s_text--disabled s_ma__0">{{ countLabel }}</p>
      </header>

      <SInput
        v-model="query"
        type="search"
        inputmode="search"
        label="Search by name"
        placeholder="e.g. Anna"
        autocomplete="off"
        hide-details
        class="s_mb__3"
      />

      <SList v-if="filteredContacts.length" divided>
        <SListItem v-for="contact in filteredContacts" :key="contact.id">
          <SListItemIcon align-center>
            <span
              class="contacts__avatar"
              :style="{ backgroundColor: contact.avatarColor }"
              aria-hidden="true"
            >
              {{ initialsOf(contact.name) }}
            </span>
          </SListItemIcon>

          <SListItemContent>
            <SListItemTitle class="s_text--truncate">{{ contact.name }}</SListItemTitle>
            <SListItemSubtitle>{{ contact.phone }}</SListItemSubtitle>
          </SListItemContent>

          <SListItemAction align-center>
            <SMenu location="bottom" close-on-content-click :min-width="MENU_MIN_WIDTH">
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
                <SListItem :href="`tel:${contact.phone.replace(/\s/g, '')}`">
                  <SListItemIcon align-center><SIcon icon="mdi-phone" /></SListItemIcon>
                  <SListItemContent>Call</SListItemContent>
                </SListItem>
                <SListItem link @click="editContact(contact)">
                  <SListItemIcon align-center><SIcon icon="mdi-pencil" /></SListItemIcon>
                  <SListItemContent>Edit</SListItemContent>
                </SListItem>
                <SListItem link @click="askDelete(contact)">
                  <SListItemIcon align-center><SIcon icon="mdi-delete" color="error" /></SListItemIcon>
                  <SListItemContent>Delete</SListItemContent>
                </SListItem>
              </SList>
            </SMenu>
          </SListItemAction>
        </SListItem>
      </SList>

      <div v-else class="s_textAlign__center s_py__8">
        <SIcon icon="mdi-account-search" size="large" class="s_text--disabled" />
        <p class="s_text--body__2 s_text--disabled">No contacts match "{{ query }}".</p>
      </div>
    </main>

    <SDialog v-model="isDeleteDialogOpen" :max-width="DIALOG_MAX_WIDTH">
      <SCard>
        <SCardTitle>Delete contact?</SCardTitle>
        <SCardText>{{ pendingDelete?.name }} will be removed from your contacts.</SCardText>
        <SCardActions>
          <SSpacer />
          <SButton variant="text" @click="isDeleteDialogOpen = false">Cancel</SButton>
          <SButton color="error" @click="confirmDelete">Delete</SButton>
        </SCardActions>
      </SCard>
    </SDialog>

    <SSnackbar v-model="isSnackbarOpen" :timeout="SNACKBAR_TIMEOUT_MS">
      {{ snackbarMessage }}
      <template #action>
        <SButton variant="text" color="warning" @click="isSnackbarOpen = false">Close</SButton>
      </template>
    </SSnackbar>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Contact {
  id: number
  name: string
  phone: string
  avatarColor: string
}

const MENU_MIN_WIDTH = 160
const DIALOG_MAX_WIDTH = 360
const SNACKBAR_TIMEOUT_MS = 3000

const contacts = ref<Contact[]>([
  { id: 1, name: 'Anna Bayar', phone: '+976 9911 2345', avatarColor: '#1565c0' },
  { id: 2, name: 'Bat-Erdene Tsog', phone: '+976 8800 1122', avatarColor: '#2e7d32' },
  { id: 3, name: 'Carlos Mendes', phone: '+1 415 555 0134', avatarColor: '#6a1b9a' },
  { id: 4, name: 'Dulmaa Ganbold', phone: '+976 9500 7788', avatarColor: '#c62828' },
  { id: 5, name: 'Emily Clarke', phone: '+44 20 7946 0958', avatarColor: '#00695c' },
  { id: 6, name: 'Farhan Siddiqui', phone: '+971 50 123 4567', avatarColor: '#4527a0' },
  { id: 7, name: 'Gerelmaa Otgon', phone: '+976 9191 3030', avatarColor: '#ad1457' },
  { id: 8, name: 'Hiroshi Tanaka', phone: '+81 90 1234 5678', avatarColor: '#37474f' },
  { id: 9, name: 'Isabella Rossi', phone: '+39 06 4567 8901', avatarColor: '#bf360c' },
  { id: 10, name: 'Jonas Becker', phone: '+49 30 901820', avatarColor: '#283593' },
])

const query = ref('')
const isDeleteDialogOpen = ref(false)
const pendingDelete = ref<Contact | null>(null)
const isSnackbarOpen = ref(false)
const snackbarMessage = ref('')

const filteredContacts = computed(() => {
  const needle = (query.value ?? '').trim().toLowerCase()
  if (!needle) {
    return contacts.value
  }
  return contacts.value.filter((contact) => contact.name.toLowerCase().includes(needle))
})

const countLabel = computed(() => {
  const count = filteredContacts.value.length
  return `${count} ${count === 1 ? 'contact' : 'contacts'}`
})

const initialsOf = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

const notify = (message: string) => {
  snackbarMessage.value = message
  isSnackbarOpen.value = true
}

const editContact = (contact: Contact) => {
  notify(`Editing ${contact.name}`)
}

const askDelete = (contact: Contact) => {
  pendingDelete.value = contact
  isDeleteDialogOpen.value = true
}

const confirmDelete = () => {
  const target = pendingDelete.value
  if (target) {
    contacts.value = contacts.value.filter((contact) => contact.id !== target.id)
    notify(`${target.name} deleted`)
  }
  pendingDelete.value = null
  isDeleteDialogOpen.value = false
}
</script>

<style scoped>
.contacts {
  max-width: 600px;
}

.contacts__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  flex-shrink: 0;
}
</style>
