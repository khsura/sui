<template>
  <SContainer class="s_py__4">
    <SBreadcrumbs :items="breadcrumbs" class="s_mb__4" />

    <SRow>
      <!-- Profile: full width on phones (rendered first), one third from md -->
      <SColumn :cols="12" :md="4">
        <SCard outlined height="100%">
          <div class="profile s_pa__4">
            <div class="profile__avatar" role="img" :aria-label="`Avatar of ${customer.name}`">
              {{ initials }}
            </div>
            <h1 class="s_text--h6 s_mt__3">{{ customer.name }}</h1>
          </div>
          <SCardText>
            <div class="s_display__flex s_align__center s_mb__2">
              <SIcon icon="mdi-email-outline" size="small" class="s_mr__2" />
              <a :href="`mailto:${customer.email}`" class="s_text__breakword">{{ customer.email }}</a>
            </div>
            <div class="s_display__flex s_align__center s_mb__4">
              <SIcon icon="mdi-phone-outline" size="small" class="s_mr__2" />
              <a :href="`tel:${customer.phone}`">{{ customer.phone }}</a>
            </div>
            <div class="s_text--caption s_mb__2">Tags</div>
            <ul class="tag-list" aria-label="Customer tags">
              <li v-for="tag in customer.tags" :key="tag">
                <SChip size="small" color="primary" outlined>{{ tag }}</SChip>
              </li>
            </ul>
          </SCardText>
        </SCard>
      </SColumn>

      <!-- Orders + Notes: stacks below the profile on phones, two thirds from md -->
      <SColumn :cols="12" :md="8">
        <SCard outlined class="s_mb__4">
          <SCardTitle>Orders</SCardTitle>
          <SCardText>
            <STable :headers="orderHeaders" :items="orders">
              <template #item.status="{ item }">
                <SChip :color="statusColor(item.status)" size="small">{{ item.status }}</SChip>
              </template>
              <template #item.total="{ item }">{{ formatCurrency(item.total) }}</template>
            </STable>
          </SCardText>
        </SCard>

        <SCard outlined>
          <SCardTitle>Notes</SCardTitle>
          <SCardText>
            <STextarea
              v-model="notes"
              label="Notes about this customer"
              :rows="NOTES_ROWS"
              :maxlength="NOTES_MAX_LENGTH"
              counter
              autogrow
            />
          </SCardText>
          <SCardActions>
            <span v-if="savedAt" class="s_text--caption" aria-live="polite">Saved at {{ savedAt }}</span>
            <SSpacer />
            <SButton color="primary" :loading="saving" :disabled="!isDirty" @click="saveNotes">Save</SButton>
          </SCardActions>
        </SCard>
      </SColumn>
    </SRow>
  </SContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SBreadcrumbs,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SChip,
  SColumn,
  SContainer,
  SIcon,
  SRow,
  SSpacer,
  STable,
  STextarea,
  type BreadcrumbsItem,
  type TableHeader,
} from '@khsura/sui'

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

interface Order {
  id: string
  date: string
  items: number
  status: OrderStatus
  total: number
}

const NOTES_ROWS = 4
const NOTES_MAX_LENGTH = 1000
const SAVE_DELAY_MS = 600

const customer = {
  name: 'Jane Cooper',
  email: 'jane.cooper@example.com',
  phone: '+1 (555) 014-2233',
  tags: ['VIP', 'Newsletter', 'Wholesale', 'Early adopter'],
}

const breadcrumbs: BreadcrumbsItem[] = [
  { text: 'Customers', to: '/customers' },
  { text: customer.name },
]

const initials = computed(() =>
  customer.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase(),
)

const orderHeaders: TableHeader[] = [
  { text: 'Order', value: 'id', sortable: true },
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Items', value: 'items', align: 'end' },
  { text: 'Status', value: 'status' },
  { text: 'Total', value: 'total', sortable: true, align: 'end' },
]

const orders: Order[] = [
  { id: '#10482', date: '2026-11-18', items: 3, status: 'Processing', total: 249.9 },
  { id: '#10391', date: '2026-10-29', items: 1, status: 'Shipped', total: 89 },
  { id: '#10217', date: '2026-09-12', items: 5, status: 'Delivered', total: 412.45 },
  { id: '#10102', date: '2026-08-03', items: 2, status: 'Cancelled', total: 58.2 },
  { id: '#09977', date: '2026-06-21', items: 4, status: 'Delivered', total: 310 },
]

const STATUS_COLORS: Record<OrderStatus, string> = {
  Delivered: 'success',
  Shipped: 'info',
  Processing: 'warning',
  Cancelled: 'error',
}
const statusColor = (status: OrderStatus) => STATUS_COLORS[status]

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatCurrency = (amount: number) => currencyFormatter.format(amount)

const savedNotes = ref('Prefers email contact. Asked about bulk pricing for Q1.')
const notes = ref(savedNotes.value)
const saving = ref(false)
const savedAt = ref('')
const isDirty = computed(() => notes.value !== savedNotes.value)

const saveNotes = async () => {
  saving.value = true
  await new Promise((resolve) => setTimeout(resolve, SAVE_DELAY_MS))
  savedNotes.value = notes.value
  savedAt.value = new Date().toLocaleTimeString()
  saving.value = false
}
</script>

<style scoped lang="scss">
@use '@khsura/sui/helpers.scss' as *;

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 500;
  background: s_getPresetColor('primary');
  color: s_getPresetColor('primary', true);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
