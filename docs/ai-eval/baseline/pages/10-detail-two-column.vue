<template>
  <SApp>
    <SContainer>
      <SBreadcrumbs :items="breadcrumbs" class="s_mb__4" />

      <SRow>
        <!-- Profile: full width on mobile (first), one third on desktop -->
        <SColumn :cols="12" :md="4">
          <SCard outlined>
            <SCardText>
              <div class="profile">
                <SImage
                  class="profile__avatar"
                  :src="customer.avatarUrl"
                  :alt="customer.name"
                  :aspect-ratio="1"
                  object-fit="cover"
                  :width="96"
                />
                <div class="s_text--h6 s_mt__3">{{ customer.name }}</div>
              </div>
            </SCardText>

            <SDivider class="full-width" />

            <SCardText>
              <div class="contact-row">
                <SIcon icon="mdi-email-outline" size="small" />
                <a :href="`mailto:${customer.email}`">{{ customer.email }}</a>
              </div>
              <div class="contact-row">
                <SIcon icon="mdi-phone-outline" size="small" />
                <a :href="`tel:${customer.phone}`">{{ customer.phone }}</a>
              </div>
            </SCardText>

            <SCardSubtitle>Tags</SCardSubtitle>
            <SCardText>
              <div class="tag-list">
                <SChip
                  v-for="tag in customer.tags"
                  :key="tag"
                  size="small"
                  color="primary"
                  outlined
                >
                  {{ tag }}
                </SChip>
              </div>
            </SCardText>
          </SCard>
        </SColumn>

        <!-- Orders + Notes: two thirds on desktop -->
        <SColumn :cols="12" :md="8">
          <SCard outlined class="s_mb__4">
            <SCardTitle>Orders</SCardTitle>
            <SCardText>
              <STable
                :headers="orderHeaders"
                :items="orders"
                item-key="id"
                hide-vertical-borders
                no-data-text="No orders yet"
              >
                <template #item.total="{ item }">
                  {{ formatCurrency(item.total) }}
                </template>
                <template #item.status="{ item }">
                  <SChip size="small" :color="statusColors[item.status]">
                    {{ item.status }}
                  </SChip>
                </template>
              </STable>
            </SCardText>
          </SCard>

          <SCard outlined>
            <SCardTitle>Notes</SCardTitle>
            <SCardText>
              <STextarea
                v-model="notes"
                label="Internal notes"
                placeholder="Add a note about this customer..."
                :rows="5"
                autogrow
                hide-details
              />
            </SCardText>
            <SCardActions>
              <span v-if="savedAt" class="s_text--caption">Saved at {{ savedAt }}</span>
              <SSpacer />
              <SButton color="primary" :disabled="!isNotesDirty" @click="saveNotes">
                Save
              </SButton>
            </SCardActions>
          </SCard>
        </SColumn>
      </SRow>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BreadcrumbsItem, TableHeader } from '@khsura/sui'

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

interface Order {
  id: string
  date: string
  items: number
  total: number
  status: OrderStatus
}

const breadcrumbs: BreadcrumbsItem[] = [
  { text: 'Customers', href: '/customers' },
  { text: 'Jane Cooper' },
]

const customer = {
  name: 'Jane Cooper',
  email: 'jane.cooper@example.com',
  phone: '+1 (555) 014-2398',
  avatarUrl: 'https://i.pravatar.cc/192?img=47',
  tags: ['VIP', 'Wholesale', 'Newsletter', 'Early adopter'],
}

const orderHeaders: TableHeader[] = [
  { text: 'Order', value: 'id', sortable: true },
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Items', value: 'items', align: 'end' },
  { text: 'Total', value: 'total', align: 'end', sortable: true },
  { text: 'Status', value: 'status' },
]

const orders: Order[] = [
  { id: '#10482', date: '2026-11-14', items: 3, total: 248.5, status: 'Processing' },
  { id: '#10391', date: '2026-10-28', items: 1, total: 79.0, status: 'Shipped' },
  { id: '#10277', date: '2026-10-02', items: 5, total: 412.75, status: 'Delivered' },
  { id: '#10154', date: '2026-09-11', items: 2, total: 135.2, status: 'Delivered' },
  { id: '#10023', date: '2026-08-19', items: 1, total: 59.99, status: 'Cancelled' },
]

const statusColors: Record<OrderStatus, string> = {
  Delivered: 'success',
  Shipped: 'info',
  Processing: 'warning',
  Cancelled: 'error',
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatCurrency = (amount: number) => currencyFormatter.format(amount)

const savedNotes = ref('Prefers email contact. Interested in the spring wholesale catalog.')
const notes = ref(savedNotes.value)
const savedAt = ref('')

const isNotesDirty = computed(() => notes.value !== savedNotes.value)

const saveNotes = () => {
  savedNotes.value = notes.value
  savedAt.value = new Date().toLocaleTimeString()
}
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile__avatar {
  border-radius: 50%;
  overflow: hidden;
}

.full-width {
  width: 100%;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  word-break: break-all;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
