<template>
  <SApp>
    <SLayout name="app">
      <SAppBar for="app" position="fixed" color="primary" elevate-on-scroll>
        <SButton variant="icon" aria-label="Toggle navigation" @click="isDrawerOpen = !isDrawerOpen">
          <SIcon icon="mdi-menu" />
        </SButton>
        <SAppBarTitle>{{ productName }}</SAppBarTitle>
        <SSpacer />
        <SButton variant="icon" :aria-label="`Account: ${currentUser.name}`">
          <span class="dashboard-avatar">{{ currentUser.initials }}</span>
        </SButton>
      </SAppBar>

      <SNavigationDrawer for="app" v-model="isDrawerOpen">
        <SList>
          <SListItem
            v-for="item in navItems"
            :key="item.id"
            link
            :class="{ 'dashboard-nav__item--active': item.id === activeNavId }"
            @click="selectNav(item.id)"
          >
            <SListItemIcon><SIcon :icon="item.icon" /></SListItemIcon>
            <SListItemContent>
              <SListItemTitle>{{ item.title }}</SListItemTitle>
            </SListItemContent>
          </SListItem>
        </SList>
      </SNavigationDrawer>

      <SMain for="app">
        <SContainer>
          <SRow>
            <SColumn :cols="12">
              <h1 class="s_text--h5 s_mt__4 s_mb__4">{{ activeNavTitle }}</h1>
              <h2 class="s_text--h6 s_mb__2">Recent orders</h2>
              <div class="dashboard-table">
                <STable :headers="orderHeaders" :items="orders" item-key="id">
                  <template #item.status="{ item }">
                    <SChip size="small" :color="statusColors[item.status]">{{ item.status }}</SChip>
                  </template>
                  <template #item.total="{ item }">
                    {{ formatCurrency(item.total) }}
                  </template>
                </STable>
              </div>
            </SColumn>
          </SRow>
        </SContainer>
      </SMain>
    </SLayout>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableHeader } from '@khsura/sui'

type OrderStatus = 'Paid' | 'Pending' | 'Shipped' | 'Cancelled'

interface Order {
  id: string
  customer: string
  date: string
  status: OrderStatus
  total: number
}

interface NavItem {
  id: string
  title: string
  icon: string
}

const productName = 'Acme Admin'

const currentUser = { name: 'Jane Doe', initials: 'JD' }

const navItems: NavItem[] = [
  { id: 'dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard' },
  { id: 'orders', title: 'Orders', icon: 'mdi-cart' },
  { id: 'customers', title: 'Customers', icon: 'mdi-account-group' },
  { id: 'reports', title: 'Reports', icon: 'mdi-chart-bar' },
  { id: 'settings', title: 'Settings', icon: 'mdi-cog' },
]

// SNavigationDrawer auto-opens on desktop and auto-closes below `md`.
const isDrawerOpen = ref(false)
const activeNavId = ref('dashboard')

const activeNavTitle = computed(
  () => navItems.find((item) => item.id === activeNavId.value)?.title ?? 'Dashboard',
)

const selectNav = (id: string) => {
  activeNavId.value = id
}

const orderHeaders: TableHeader[] = [
  { text: 'Order #', value: 'id', sortable: true },
  { text: 'Customer', value: 'customer', sortable: true },
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Status', value: 'status' },
  { text: 'Total', value: 'total', align: 'end', sortable: true },
]

const orders: Order[] = [
  { id: '#10421', customer: 'Olivia Martin', date: '2026-11-20', status: 'Paid', total: 249.0 },
  { id: '#10420', customer: 'Liam Johnson', date: '2026-11-20', status: 'Pending', total: 89.5 },
  { id: '#10419', customer: 'Emma Wilson', date: '2026-11-19', status: 'Shipped', total: 412.75 },
  { id: '#10418', customer: 'Noah Brown', date: '2026-11-19', status: 'Cancelled', total: 35.0 },
  { id: '#10417', customer: 'Ava Davis', date: '2026-11-18', status: 'Paid', total: 158.2 },
  { id: '#10416', customer: 'Lucas Garcia', date: '2026-11-18', status: 'Shipped', total: 999.99 },
  { id: '#10415', customer: 'Mia Rodriguez', date: '2026-11-17', status: 'Pending', total: 64.3 },
  { id: '#10414', customer: 'Ethan Lee', date: '2026-11-17', status: 'Paid', total: 320.0 },
]

const statusColors: Record<OrderStatus, string> = {
  Paid: 'success',
  Pending: 'warning',
  Shipped: 'info',
  Cancelled: 'error',
}

const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const formatCurrency = (amount: number) => currencyFormatter.format(amount)
</script>

<style scoped>
.dashboard-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  color: var(--s-color-primary, #1976d2);
  font-size: 0.8125rem;
  font-weight: 600;
}

.dashboard-nav__item--active {
  background: color-mix(in srgb, var(--s-color-primary, #1976d2) 14%, transparent);
  color: var(--s-color-primary, #1976d2);
  font-weight: 600;
}

.dashboard-table {
  width: 100%;
  overflow-x: auto;
}
</style>
