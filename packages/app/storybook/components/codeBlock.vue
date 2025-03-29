<template>
  <code class="hljs" :class="{ [`language-${language}`]: language }"><slot></slot></code>
</template>
<script lang="ts" setup>
defineProps({
  language: {
    type: String,
    default: null,
  },
})
</script>
