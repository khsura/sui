<template>
  <SContainer>
    <p v-for="p in paragraphs" :key="p">
      {{ p }}
    </p>
    <SToolbar color="primary">
      <div class="s_ml__3 s_text--h5">Toolbar</div>
    </SToolbar>
    <SCard>
      <SCardTitle>Card Title</SCardTitle>
    </SCard>
  </SContainer>
</template>

<script lang="ts" setup>
import { faker } from '@khsura/shared'
import { SContainer, SCard, SCardTitle, SToolbar } from '@khsura/sui/components'

const paragraphs = faker.lorem.paragraphs(45).split('\n')
</script>
