import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import { type Component } from 'vue'
import { SApp } from '@/app/components'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mountWithApp = (component: Component, mountingOptions?: ComponentMountingOptions<any, any>) => {
  const parentWrapper = mount(SApp)
  const container = parentWrapper.find('.s_app').element

  return mount(component, {
    ...mountingOptions,
    attachTo: container,
  })
}
