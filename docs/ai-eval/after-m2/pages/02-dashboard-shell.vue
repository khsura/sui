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
        <SAppBarTitle>{{ PRODUCT_NAME }}</SAppBarTitle>
        <SSpacer />
        <SButton variant="icon" :aria-label="`Account: ${currentUser.name}`">
          <span class="user-avatar" aria-hidden="true">{{ currentUser.initials }}</span>
        </SButton>
      </SAppBar>

      <SNavigationDrawer v-model="isDrawerOpen" for="admin" activator="#admin-menu-button" :elevation="1">
        <nav aria-label="Main navigation">
          <SList>
            <SListItem
              v-for="navItem in navItems"
              :key="navItem.title"
              link
              :aria-current="navItem.title === currentPage ? 'page' : undefined"
              @click="selectPage(navItem.title)"
            >
              <SListItemIcon>
                <SIcon :icon="navItem.icon" />
              </SListItemIcon>
              <SListItemContent>
                <SListItemTitle>{{ navItem.title }}</SListItemTitle>
              </SListItemContent>
            </SListItem>
          </SList>
        </nav>
      </SNavigationDrawer>

      <SMain for="admin">
        <SContainer>
          <h1 class="s_text--h5 s_mb__2">{{ currentPage }}</h1>
          <h2 class="s_text--subtitle__1 s_mb__2">Recent orders</h2>
          <div class="table-scroll">
            <STable :headers="orderHeaders" :items="recentOrders" outlined>
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

type OrderStatus = 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'

interface NavItem {
  title: string
  icon: string
}

interface Order {
  orderNumber: string
  customer: string
  date: string
  status: OrderStatus
  total: number
}

const PRODUCT_NAME = 'Acme Admin'

const currentUser = { name: 'Jane Doe', initials: 'JD' }

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Orders', icon: 'mdi-cart' },
  { title: 'Customers', icon: 'mdi-account-group' },
  { title: 'Reports', icon: 'mdi-chart-bar' },
  { title: 'Settings', icon: 'mdi-cog' },
]

const orderHeaders: TableHeader[] = [
  { text: 'Order #', value: 'orderNumber', sortable: true },
  { text: 'Customer', value: 'customer', sortable: true },
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Status', value: 'status' },
  { text: 'Total', value: 'total', sortable: true, align: 'end' },
]

const recentOrders: Order[] = [
  { orderNumber: '#10248', customer: 'Olivia Martin', date: '2026-11-21', status: 'Processing', total: 129.99 },
  { orderNumber: '#10247', customer: 'Liam Johnson', date: '2026-11-21', status: 'Shipped', total: 84.5 },
  { orderNumber: '#10246', customer: 'Emma Brown', date: '2026-11-20', status: 'Delivered', total: 249 },
  { orderNumber: '#10245', customer: 'Noah Davis', date: '2026-11-20', status: 'Cancelled', total: 39.95 },
  { orderNumber: '#10244', customer: 'Ava Wilson', date: '2026-11-19', status: 'Delivered', total: 310.2 },
  { orderNumber: '#10243', customer: 'Lucas Garcia', date: '2026-11-19', status: 'Shipped', total: 58 },
  { orderNumber: '#10242', customer: 'Mia Anderson', date: '2026-11-18', status: 'Delivered', total: 172.4 },
  { orderNumber: '#10241', customer: 'Ethan Thomas', date: '2026-11-18', status: 'Processing', total: 95.75 },
]

const statusColors: Record<OrderStatus, string> = {
  Delivered: 'success',
  Shipped: 'info',
  Processing: 'warning',
  Cancelled: 'error',
}

const totalFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatTotal = (total: number) => totalFormatter.format(total)

const { mdAndUp } = useDisplay()
// Desktop: drawer open beside the content. Mobile: hidden by default, slides over the content.
const isDrawerOpen = ref(mdAndUp.value)
const currentPage = ref('Dashboard')

const selectPage = (title: string) => {
  currentPage.value = title
  if (!mdAndUp.value) isDrawerOpen.value = false
}
</script>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.24);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
}

.table-scroll {
  overflow-x: auto;
}
</style>
