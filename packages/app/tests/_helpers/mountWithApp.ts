import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import { defineComponent, type Component, type ComponentPublicInstance } from 'vue'
import { SApp } from '@/app/components'

export const mountWithApp = <T extends Component>(component: T, mountingOptions?: ComponentMountingOptions<T>) => {
  const wrapper = mount(
    defineComponent({
      components: { SApp, comp: component },
      inheritAttrs: false,
      props: Object.keys(mountingOptions?.props ?? {}),
      template: `<SApp><comp v-bind="$props" /></SApp>`,
    }),
    {
      ...mountingOptions,
    },
  )

  return wrapper.findComponent<ComponentPublicInstance<T>>(component)
}
