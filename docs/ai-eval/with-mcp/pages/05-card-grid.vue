<template>
  <SApp>
    <SContainer>
      <SRow justify="spaceBetween" align="center">
        <SColumn cols="auto">
          <h1 class="s_text--h5">Product catalog</h1>
        </SColumn>
        <SColumn cols="auto">
          <SBadge
            value
            overlap
            color="error"
            :content="String(cartCount)"
            :label="`${cartCount} items in cart`"
          >
            <SButton color="primary" @click="showCartSummary">
              <SIcon icon="mdi-cart" />
              <span class="s_ml__2">Cart</span>
            </SButton>
          </SBadge>
        </SColumn>
      </SRow>

      <SRow>
        <SColumn
          v-for="product in products"
          :key="product.id"
          :cols="12"
          :sm="6"
          :lg="3"
        >
          <SCard :elevation="2" class="product-card">
            <SImage
              :src="product.image"
              :alt="product.name"
              :aspect-ratio="4 / 3"
              object-fit="cover"
            >
              <div v-if="product.tag" class="s_pa__2">
                <SBadge
                  value
                  inline
                  :color="product.tag === 'Sale' ? 'error' : 'success'"
                  :content="product.tag"
                  :label="product.tag"
                />
              </div>
            </SImage>

            <SCardTitle>{{ product.name }}</SCardTitle>

            <SCardText>
              <div class="s_text--h6 s_mb__2">{{ formatPrice(product.price) }}</div>
              <div class="chip-row">
                <SChip
                  v-for="category in product.categories"
                  :key="category"
                  size="small"
                  outlined
                  color="primary"
                >
                  {{ category }}
                </SChip>
              </div>
            </SCardText>

            <SCardActions>
              <SButton color="primary" block @click="addToCart(product)">
                <SIcon icon="mdi-cart-plus" />
                <span class="s_ml__2">Add to cart</span>
              </SButton>
            </SCardActions>
          </SCard>
        </SColumn>
      </SRow>

      <p v-if="statusMessage" class="s_text--body__2 s_mt__2" role="status">
        {{ statusMessage }}
      </p>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SApp,
  SBadge,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SChip,
  SColumn,
  SContainer,
  SIcon,
  SImage,
  SRow,
} from '@khsura/sui'

type ProductTag = 'New' | 'Sale'

interface Product {
  id: number
  name: string
  price: number
  image: string
  categories: string[]
  tag?: ProductTag
}

const IMAGE_BASE = 'https://picsum.photos/seed'

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 129.99, image: `${IMAGE_BASE}/headphones/640/480`, categories: ['Audio', 'Electronics'], tag: 'New' },
  { id: 2, name: 'Smart Watch', price: 199.0, image: `${IMAGE_BASE}/watch/640/480`, categories: ['Wearables', 'Electronics'], tag: 'Sale' },
  { id: 3, name: 'Leather Backpack', price: 89.5, image: `${IMAGE_BASE}/backpack/640/480`, categories: ['Bags', 'Travel'] },
  { id: 4, name: 'Ceramic Coffee Mug', price: 14.99, image: `${IMAGE_BASE}/mug/640/480`, categories: ['Kitchen'], tag: 'New' },
  { id: 5, name: 'Running Shoes', price: 74.0, image: `${IMAGE_BASE}/shoes/640/480`, categories: ['Sports', 'Footwear'], tag: 'Sale' },
  { id: 6, name: 'Desk Lamp', price: 39.9, image: `${IMAGE_BASE}/lamp/640/480`, categories: ['Home', 'Office'] },
  { id: 7, name: 'Bluetooth Speaker', price: 59.99, image: `${IMAGE_BASE}/speaker/640/480`, categories: ['Audio'], tag: 'New' },
  { id: 8, name: 'Yoga Mat', price: 24.0, image: `${IMAGE_BASE}/yoga/640/480`, categories: ['Sports', 'Fitness'] },
]

const cartItems = ref<Product[]>([])
const cartCount = computed(() => cartItems.value.length)
const statusMessage = ref('')

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatPrice = (price: number) => priceFormatter.format(price)

const addToCart = (product: Product) => {
  cartItems.value = [...cartItems.value, product]
  statusMessage.value = `Added "${product.name}" to your cart.`
}

const showCartSummary = () => {
  const cartTotal = cartItems.value.reduce((sum, item) => sum + item.price, 0)
  statusMessage.value = cartCount.value
    ? `Your cart has ${cartCount.value} item(s), totalling ${formatPrice(cartTotal)}.`
    : 'Your cart is empty.'
}
</script>

<style scoped>
.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
