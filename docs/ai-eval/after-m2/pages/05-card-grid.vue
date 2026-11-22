<template>
  <SContainer class="s_py__4">
    <SRow justify="spaceBetween" align="center">
      <SColumn cols="auto">
        <h1 class="s_text--h5">Product catalog</h1>
      </SColumn>
      <SColumn cols="auto">
        <SBadge
          :value="cartCount > 0"
          :content="String(cartCount)"
          :label="`${cartCount} items in cart`"
          color="error"
          overlap
        >
          <SButton color="primary" outlined aria-label="Open cart">
            <SIcon icon="mdi-cart" />
            <span class="s_ml__2">Cart</span>
          </SButton>
        </SBadge>
      </SColumn>
    </SRow>

    <SRow>
      <SColumn v-for="product in products" :key="product.id" :cols="12" :sm="6" :lg="3">
        <SCard height="100%" outlined>
          <div class="product-media">
            <SImage
              :src="product.image"
              :alt="product.name"
              :aspect-ratio="IMAGE_ASPECT_RATIO"
              height="auto"
              object-fit="cover"
            />
            <SBadge
              v-if="product.flag"
              class="product-flag"
              value
              inline
              tile
              :content="FLAG_LABELS[product.flag]"
              :color="FLAG_COLORS[product.flag]"
            />
          </div>
          <SCardTitle>{{ product.name }}</SCardTitle>
          <SCardText>
            <div class="s_text--subtitle__1">{{ formatPrice(product.price) }}</div>
            <div class="product-chips">
              <SChip v-for="category in product.categories" :key="category" size="small" outlined>
                {{ category }}
              </SChip>
            </div>
          </SCardText>
          <SCardActions>
            <SButton color="primary" block @click="addToCart">
              Add to cart
            </SButton>
          </SCardActions>
        </SCard>
      </SColumn>
    </SRow>
  </SContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
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

type ProductFlag = 'new' | 'sale'

interface Product {
  id: number
  name: string
  price: number
  image: string
  categories: string[]
  flag?: ProductFlag
}

const IMAGE_ASPECT_RATIO = 4 / 3

const FLAG_LABELS: Record<ProductFlag, string> = { new: 'New', sale: 'Sale' }
const FLAG_COLORS: Record<ProductFlag, string> = { new: 'success', sale: 'error' }

const products: Product[] = [
  { id: 1, name: 'Desk lamp', price: 49, image: 'https://picsum.photos/seed/lamp/400/300', categories: ['Home', 'Lighting'], flag: 'new' },
  { id: 2, name: 'Wireless headphones', price: 129, image: 'https://picsum.photos/seed/headphones/400/300', categories: ['Audio', 'Electronics'], flag: 'sale' },
  { id: 3, name: 'Ceramic mug', price: 18, image: 'https://picsum.photos/seed/mug/400/300', categories: ['Kitchen'] },
  { id: 4, name: 'Leather notebook', price: 32, image: 'https://picsum.photos/seed/notebook/400/300', categories: ['Office', 'Stationery'] },
  { id: 5, name: 'Running shoes', price: 89, image: 'https://picsum.photos/seed/shoes/400/300', categories: ['Sports', 'Footwear'], flag: 'sale' },
  { id: 6, name: 'Smart watch', price: 199, image: 'https://picsum.photos/seed/watch/400/300', categories: ['Electronics', 'Wearables'], flag: 'new' },
  { id: 7, name: 'Plant pot', price: 24, image: 'https://picsum.photos/seed/plant/400/300', categories: ['Home', 'Garden'] },
  { id: 8, name: 'Backpack', price: 75, image: 'https://picsum.photos/seed/backpack/400/300', categories: ['Travel', 'Bags'] },
]

const cartCount = ref(0)

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatPrice = (price: number): string => priceFormatter.format(price)

const addToCart = (): void => {
  cartCount.value += 1
}
</script>

<style scoped>
.product-media {
  position: relative;
}

.product-flag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.product-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}
</style>
