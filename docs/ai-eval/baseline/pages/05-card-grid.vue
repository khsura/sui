<template>
  <SApp>
    <SContainer>
      <div class="s_display__flex s_align__center s_justify__spaceBetween s_mb__6">
        <h1 class="catalog__title">Product catalog</h1>
        <SBadge
          value
          overlap
          color="error"
          :content="String(cartCount)"
          :label="`${cartCount} items in cart`"
        >
          <SButton color="primary" rounded>
            <SIcon icon="mdi-cart" />
            <span class="s_ml__2">Cart</span>
          </SButton>
        </SBadge>
      </div>

      <SRow>
        <SColumn
          v-for="product in products"
          :key="product.id"
          :cols="12"
          :sm="6"
          :md="3"
        >
          <SCard :elevation="2" class="product-card">
            <SImage
              :src="product.image"
              :alt="product.name"
              :aspect-ratio="4 / 3"
              object-fit="cover"
            >
              <div v-if="product.tag" class="product-card__badge">
                <SBadge
                  value
                  inline
                  tile
                  :color="tagColors[product.tag]"
                  :content="product.tag"
                  :label="product.tag"
                />
              </div>
            </SImage>

            <SCardTitle>{{ product.name }}</SCardTitle>
            <SCardSubtitle>{{ formatPrice(product.price) }}</SCardSubtitle>

            <SCardText>
              <div class="product-card__chips">
                <SChip
                  v-for="category in product.categories"
                  :key="category"
                  size="small"
                  outlined
                  color="secondary"
                >
                  {{ category }}
                </SChip>
              </div>
            </SCardText>

            <SCardActions>
              <SButton color="primary" block @click="addToCart">
                <SIcon icon="mdi-cart-plus" />
                <span class="s_ml__2">Add to cart</span>
              </SButton>
            </SCardActions>
          </SCard>
        </SColumn>
      </SRow>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SApp,
  SBadge,
  SButton,
  SCard,
  SCardActions,
  SCardSubtitle,
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

const tagColors: Record<ProductTag, string> = {
  New: 'success',
  Sale: 'error',
}

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 129.99, image: 'https://picsum.photos/seed/headphones/400/300', categories: ['Audio', 'Electronics'], tag: 'New' },
  { id: 2, name: 'Leather Backpack', price: 89.5, image: 'https://picsum.photos/seed/backpack/400/300', categories: ['Bags', 'Travel'], tag: 'Sale' },
  { id: 3, name: 'Smart Watch', price: 199, image: 'https://picsum.photos/seed/watch/400/300', categories: ['Wearables', 'Electronics'] },
  { id: 4, name: 'Running Shoes', price: 74.99, image: 'https://picsum.photos/seed/shoes/400/300', categories: ['Footwear', 'Sports'], tag: 'Sale' },
  { id: 5, name: 'Ceramic Coffee Mug', price: 14.99, image: 'https://picsum.photos/seed/mug/400/300', categories: ['Kitchen'] },
  { id: 6, name: 'Desk Lamp', price: 39.9, image: 'https://picsum.photos/seed/lamp/400/300', categories: ['Home', 'Lighting'], tag: 'New' },
  { id: 7, name: 'Bluetooth Speaker', price: 59, image: 'https://picsum.photos/seed/speaker/400/300', categories: ['Audio', 'Electronics'] },
  { id: 8, name: 'Yoga Mat', price: 29.99, image: 'https://picsum.photos/seed/yoga/400/300', categories: ['Sports', 'Fitness'], tag: 'New' },
]

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatPrice = (price: number) => priceFormatter.format(price)

const cartCount = ref(0)
const addToCart = () => {
  cartCount.value += 1
}
</script>

<style scoped>
.catalog__title {
  margin: 0;
  font-size: 1.75rem;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.product-card__badge {
  position: absolute;
  top: 8px;
  left: 8px;
}

.product-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
