<template>
  <SApp>
    <SLayout name="admin" height="100vh">
      <SAppBar for="admin" position="fixed" :elevation="2">
        <SButton
          id="admin-menu-button"
          variant="icon"
          aria-label="Toggle navigation"
          @click="isDrawerOpen = !isDrawerOpen"
        >
          <SIcon icon="mdi-menu" />
        </SButton>
        <SAppBarTitle>Acme Admin</SAppBarTitle>
        <SSpacer />
        <SButton variant="icon" aria-label="User account">
          <SIcon icon="mdi-account-circle" />
        </SButton>
      </SAppBar>

      <SNavigationDrawer v-model="isDrawerOpen" for="admin" activator="#admin-menu-button" :elevation="1">
        <SList>
          <SListItem v-for="navItem in navItems" :key="navItem.title" link @click="selectPage(navItem.title)">
            <SListItemIcon>
              <SIcon :icon="navItem.icon" />
            </SListItemIcon>
            <SListItemContent>
              <SListItemTitle>{{ navItem.title }}</SListItemTitle>
            </SListItemContent>
          </SListItem>
        </SList>
      </SNavigationDrawer>

      <SMain for="admin">
        <SContainer>
          <h1 class="s_text--h5 s_mb__2">{{ currentPage }}</h1>
          <h2 class="s_text--subtitle__1 s_mb__2">Recent orders</h2>
          <div class="orders-table-wrapper">
            <STable :headers="orderHeaders" :items="orders" item-key="id" outlined>
              <template #item.status="{ item }">
                <SChip :color="statusColors[item.status]" size="small">{{ item.status }}</SChip>
              </template>
              <template #item.total="{ item }">{{ formatTotal(item.total) }}</template>
            </STable>
          </div>
        </SContainer>
      </SMain>
    </SLayout>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SApp,
  SAppBar,
  SAppBarTitle,
  SButton,
  SChip,
  SContainer,
  SIcon,
  SLayout,
  SList,
  SListItem,
  SListItemContent,
  SListItemIcon,
  SListItemTitle,
  SMain,
  SNavigationDrawer,
  SSpacer,
  STable,
  useDisplay,
  type TableHeader,
} from '@khsura/sui'

interface NavItem {
  title: string
  icon: string
}

type OrderStatus = 'Paid' | 'Pending' | 'Shipped' | 'Cancelled'

interface Order {
  id: string
  customer: string
  date: string
  status: OrderStatus
  total: number
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Orders', icon: 'mdi-cart' },
  { title: 'Customers', icon: 'mdi-account-group' },
  { title: 'Reports', icon: 'mdi-chart-bar' },
  { title: 'Settings', icon: 'mdi-cog' },
]

const orderHeaders: TableHeader[] = [
  { text: 'Order #', value: 'id', sortable: true },
  { text: 'Customer', value: 'customer', sortable: true },
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Status', value: 'status' },
  { text: 'Total', value: 'total', sortable: true, align: 'end' },
]

const orders: Order[] = [
  { id: '#10421', customer: 'Olivia Martin', date: '2026-11-20', status: 'Paid', total: 249.99 },
  { id: '#10420', customer: 'Liam Johnson', date: '2026-11-20', status: 'Pending', total: 89.5 },
  { id: '#10419', customer: 'Emma Brown', date: '2026-11-19', status: 'Shipped', total: 412.0 },
  { id: '#10418', customer: 'Noah Davis', date: '2026-11-19', status: 'Cancelled', total: 35.25 },
  { id: '#10417', customer: 'Ava Wilson', date: '2026-11-18', status: 'Paid', total: 158.4 },
  { id: '#10416', customer: 'Elijah Moore', date: '2026-11-18', status: 'Shipped', total: 72.0 },
  { id: '#10415', customer: 'Sophia Taylor', date: '2026-11-17', status: 'Pending', total: 530.75 },
  { id: '#10414', customer: 'James Anderson', date: '2026-11-17', status: 'Paid', total: 199.0 },
]

const statusColors: Record<OrderStatus, string> = {
  Paid: 'success',
  Pending: 'warning',
  Shipped: 'info',
  Cancelled: 'error',
}

const totalFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatTotal = (total: number) => totalFormatter.format(total)

const { mdAndUp } = useDisplay()
// Open beside the content on desktop; hidden (temporary overlay) on mobile.
const isDrawerOpen = ref(mdAndUp.value)
const currentPage = ref('Dashboard')

const selectPage = (title: string) => {
  currentPage.value = title
  if (!mdAndUp.value) isDrawerOpen.value = false
}
</script>

<style scoped>
.orders-table-wrapper {
  overflow-x: auto;
}
</style>
