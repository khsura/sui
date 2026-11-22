import type { ComponentNames } from '../types'

/** definitions/props/propsX.ts: the public props type, built from the shared core props. */
export const renderPropsFile = (names: ComponentNames): string => `import { type PropsColor } from './core'
import { type PropsSizePreset } from './propsSizePreset'

// TODO(scaffold): add the ${names.component} props. Give every prop a JSDoc comment: it becomes the description in
// sui-api.json, which the MCP get_component_api tool and the skill tables show to AI assistants.
export type ${names.propsType} = {
  /** Text shown when the default slot is empty. Replace this example prop with the real ones. */
  text?: string | undefined
} & PropsColor &
  PropsSizePreset
`

/** components/sX.vue: colour (incl. the per-component theme), size presets and component defaults, wired like SChip. */
export const renderComponentFile = (names: ComponentNames): string => `<template>
  <div :class="classList" :style="styleList">
    <slot>{{ props.text }}</slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { getCleanSetObject } from '@/app/lib'
import type { ${names.propsType} } from '@/app/definitions'
import { useColorService, useComponentDefaultsService, useSizeService } from '@/app/services'

const rawProps = defineProps<${names.propsType}>()
const props = useComponentDefaultsService('${names.component}', rawProps)
const { classListColor, styleListColor } = useColorService(props)
const { classListSize } = useSizeService(props, { block: '${names.camel}' })

const classList = computed(() => {
  return {
    ${names.cssBlock}: true,
    ...classListColor.value,
    ...classListSize.value,
  }
})

const styleList = computed(() => {
  return getCleanSetObject({
    ...styleListColor.value,
  })
})

defineSlots<{
  default: () => void
}>()
</script>
<style lang="scss">
// Sizes come from !default variables, never hard-coded in a rule, so a global density can scale them later.
$${names.cssBlock}--padding: calc($s_spacer * 2) !default;

.${names.cssBlock} {
  @include s_dark();
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: $${names.cssBlock}--padding;
  color: s_getAppColor('text');

  @each $name, $fontSize in $s_button--fontSizes {
    &--size__#{$name} {
      font-size: $fontSize;
    }
  }
}
</style>
`
