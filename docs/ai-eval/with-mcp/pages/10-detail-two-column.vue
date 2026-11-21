<template>
  <SContainer>
    <SRow>
      <SColumn :cols="12">
        <SBreadcrumbs :items="breadcrumbs" />
      </SColumn>
    </SRow>

    <SRow>
      <!-- Profile comes first in the markup, so it stacks above the orders on phones. -->
      <SColumn :cols="12" :md="4">
        <SCard outlined>
          <SCardText>
            <div class="customer-profile">
              <div class="customer-profile__avatar">
                <SImage :src="customer.avatarUrl" :alt="customer.name" :aspect-ratio="1" object-fit="cover" :width="AVATAR_SIZE" />
              </div>
              <h1 class="s_text--h5 s_mt__3">{{ customer.name }}</h1>
              <div class="s_text--body__2 s_mt__2">
                <a :href="`mailto:${customer.email}`">{{ customer.email }}</a>
              </div>
              <div class="s_text--body__2 s_mt__1">
                <a :href="`tel:${customer.phone}`">{{ customer.phone }}</a>
              </div>
            </div>
          </SCardText>
          <SDivider />
          <SCardText>
            <div class="s_text--overline s_mb__2">Tags</div>
            <div class="customer-profile__tags">
              <SChip v-for="tag in customer.tags" :key="tag" color="primary" size="small" outlined>{{ tag }}</SChip>
            </div>
          </SCardText>
        </SCard>
      </SColumn>

      <SColumn :cols="12" :md="8">
        <SCard outlined>
          <SCardTitle>Orders</SCardTitle>
          <SCardText>
            <STable :headers="orderHeaders" :items="orders">
              <template #item.status="{ item }">
                <SChip :color="statusColors[item.status]" size="small">{{ item.status }}</SChip>
              </template>
              <template #item.total="{ item }">{{ formatCurrency(item.total) }}</template>
            </STable>
          </SCardText>
        </SCard>

        <SCard outlined class="s_mt__4">
          <SCardTitle>Notes</SCardTitle>
          <SCardText>
            <STextarea id="customer-notes" v-model="notes" label="Notes" :rows="NOTES_ROWS" autogrow hide-details />
          </SCardText>
          <SCardActions>
            <span v-if="savedAt" class="s_text--caption">Saved at {{ savedAt }}</span>
            <SSpacer />
            <SButton color="primary" :disabled="!isNotesDirty" @click="saveNotes">Save</SButton>
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
  SDivider,
  SImage,
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

interface Customer {
  name: string
  email: string
  phone: string
  avatarUrl: string
  tags: string[]
}

const AVATAR_SIZE = 96
const NOTES_ROWS = 5

const customer: Customer = {
  name: 'Jane Cooper',
  email: 'jane.cooper@example.com',
  phone: '+1 (555) 014-2398',
  avatarUrl: 'https://i.pravatar.cc/192?img=47',
  tags: ['VIP', 'Newsletter', 'Wholesale', 'Early adopter'],
}

// The last item is disabled automatically (current page).
const breadcrumbs: BreadcrumbsItem[] = [
  { text: 'Customers', href: '#customers' },
  { text: customer.name },
]

const orderHeaders: TableHeader[] = [
  { text: 'Order', value: 'id' },
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Items', value: 'items', align: 'end' },
  { text: 'Status', value: 'status' },
  { text: 'Total', value: 'total', sortable: true, align: 'end' },
]

const orders: Order[] = [
  { id: '#10482', date: '2026-11-14', items: 3, status: 'Processing', total: 248.5 },
  { id: '#10391', date: '2026-10-29', items: 1, status: 'Shipped', total: 89 },
  { id: '#10217', date: '2026-10-02', items: 5, status: 'Delivered', total: 412.75 },
  { id: '#10044', date: '2026-08-18', items: 2, status: 'Cancelled', total: 64.2 },
  { id: '#09876', date: '2026-07-05', items: 4, status: 'Delivered', total: 305 },
]

const statusColors: Record<OrderStatus, string> = {
  Delivered: 'success',
  Shipped: 'info',
  Processing: 'warning',
  Cancelled: 'error',
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatCurrency = (amount: number) => currencyFormatter.format(amount)

const savedNotes = ref('Prefers email contact. Ask about bulk pricing on the next order.')
const notes = ref(savedNotes.value)
const savedAt = ref('')
const isNotesDirty = computed(() => notes.value !== savedNotes.value)

const saveNotes = () => {
  savedNotes.value = notes.value
  savedAt.value = new Date().toLocaleTimeString()
}
</script>

<style scoped>
.customer-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.customer-profile__avatar {
  border-radius: 50%;
  overflow: hidden;
}

.customer-profile__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
