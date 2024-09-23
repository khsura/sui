<template>
  <SApp app>
    <SAppBar
      :fixed-extension="fixedExtension"
      :color="color"
      :app="app"
      :color-threshold="colorThreshold"
      :content-class="contentClass"
      :density="density"
      :elevate-on-scroll="elevateOnScroll"
      :elevation="elevation"
      :extension-class="extensionClass"
      :extension-height="extensionHeight"
      :extended="extended"
      :content-style="contentStyle"
      :extension-style="extensionStyle"
      :height="height"
      :hide-on-scroll="hideOnScroll"
      :outlined="outlined"
      :position="position"
    >
      Sample App
      <template #extension>
        <span>Extension</span>
      </template>
    </SAppBar>
    <SMain app>
      <SCard>
        <SCardText>
          <SSwitch v-model="app" label="App" />
          <SSwitch v-model="fixedExtension" label="Fixed Extension" />
          <SSwitch v-model="outlined" label="Outlined" />
          <SSwitch v-model="hideOnScroll" label="Hide on Scroll" />
          <SSwitch v-model="elevateOnScroll" label="Elevate on Scroll" />
          <SSwitch v-model="extended" label="Extended" />
          <SSelect v-model="density" label="Density" :items="['default', 'comfortable', 'compact']" />
          <SSelect v-model="position" label="Position" :items="positions" />
          <SSelect
            v-model="color"
            label="Color"
            :items="['primary', 'secondary', 'success', 'info', 'warning', 'important', 'error']"
          />
        </SCardText>
      </SCard>
      <router-view />
    </SMain>
    <SFooter>Footer</SFooter>
  </SApp>
</template>
<script lang="ts" setup>
import { SApp, SAppBar, SCard, SCardText, SFooter, SMain } from '@khsura/sui/components'
import SSelect from '@khsura/sui/components/form/sSelect.vue'
import SSwitch from '@khsura/sui/components/sSwitch.vue'
import { type Position } from '@khsura/sui/constants'
import { type ToolbarDensityType } from '@khsura/sui/types'
import { computed, ref } from 'vue'

const app = ref(true)
const fixedExtension = ref(false)
const color = ref<string | undefined>(undefined)
const colorThreshold = ref(50)
const contentClass = ref('')
const density = ref<ToolbarDensityType>('compact')
const elevateOnScroll = ref(false)
const elevation = ref(0)
const extensionClass = ref('')
const extensionHeight = ref(48)
const extended = ref(false)
const contentStyle = ref({})
const extensionStyle = ref({})
const height = ref(64)
const hideOnScroll = ref(false)
const outlined = ref(false)
const position = ref<Exclude<Position, null>>('static')

const positions = computed(() => {
  return ['static', 'fixed', 'absolute', 'relative', 'sticky', undefined] as Array<Exclude<Position, null>>
})
</script>
