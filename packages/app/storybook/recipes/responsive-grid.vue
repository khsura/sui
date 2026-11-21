<template>
  <SContainer>
    <SRow>
      <SColumn :cols="12" :md="8">
        <SCard class="s_pa__4" :height="160">
          <h2 class="s_text--h6">Main panel</h2>
          <p class="s_text--body__2">Full width on phones, two thirds from the md breakpoint.</p>
        </SCard>
      </SColumn>
      <SColumn :cols="12" :md="4">
        <SCard class="s_pa__4" :height="160">
          <h2 class="s_text--h6">Side panel</h2>
          <p class="s_text--body__2">Stacks below the main panel on phones.</p>
        </SCard>
      </SColumn>
    </SRow>

    <SRow>
      <SColumn v-for="stat in stats" :key="stat.label" :cols="12" :sm="6" :lg="3">
        <SCard class="s_pa__4" outlined>
          <div class="s_text--caption">{{ stat.label }}</div>
          <div class="s_text--h5">{{ stat.value }}</div>
        </SCard>
      </SColumn>
    </SRow>

    <SRow justify="spaceBetween" align="center">
      <SColumn cols="auto">
        <span class="s_text--subtitle__1">Showing 4 of 12</span>
      </SColumn>
      <SColumn cols="auto">
        <SButton color="primary">Load more</SButton>
      </SColumn>
    </SRow>
  </SContainer>
</template>

<script setup lang="ts">
import { SButton, SCard, SColumn, SContainer, SRow } from '@khsura/sui'

interface Stat {
  label: string
  value: string
}

const stats: Stat[] = [
  { label: 'Revenue', value: '$48,200' },
  { label: 'Orders', value: '1,284' },
  { label: 'Customers', value: '912' },
  { label: 'Refunds', value: '14' },
]
</script>
