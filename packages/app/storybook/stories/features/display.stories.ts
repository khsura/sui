import type { Meta } from '@storybook/vue3-vite'
import { defineComponent, computed } from 'vue'
import { useDisplay } from '@/app/index'
import { createStoryObj } from '@/app/storybook/helpers'

const display: Meta = {
  title: 'Features/Display',
}

export default display

export const Display = createStoryObj({
  render: () => {
    return defineComponent({
      components: {},
      setup: () => {
        const {
          width,
          height,
          isTouchDevice,
          xs,
          sm,
          smAndDown,
          smAndUp,
          md,
          mdAndDown,
          mdAndUp,
          lg,
          lgAndDown,
          lgAndUp,
          xl,
          name,
          mobile,
          xxl,
        } = useDisplay()

        const displayProperties = computed(() => {
          return {
            width: width.value,
            height: height.value,
            mobile: mobile.value,
            isTouchDevice: isTouchDevice.value,
            xs: xs.value,
            smAndDown: smAndDown.value,
            sm: sm.value,
            smAndUp: smAndUp.value,
            mdAndDown: mdAndDown.value,
            md: md.value,
            mdAndUp: mdAndUp.value,
            lgAndDown: lgAndDown.value,
            lg: lg.value,
            lgAndUp: lgAndUp.value,
            xl: xl.value,
            xxl: xxl.value,
            name: name.value,
          }
        })

        return {
          displayProperties,
        }
      },
      template: `
      <div style="max-width: 100%; overflow-x: auto;" class="s_pa__3">
        <table style="border-collapse: collapse; border: 1px solid black;">
          <tr>
            <th style="padding: 4px 16px; border-collapse: collapse; border: 1px solid black;">property</th>
            <th style="padding: 4px 16px; border-collapse: collapse; border: 1px solid black;">value</th>
            <th style="padding: 4px 16px; border-collapse: collapse; border: 1px solid black;">description</th>
          </tr>
          <tr v-for="(value, key) in displayProperties" :key="key">
            <td style="padding: 4px 16px; border-collapse: collapse; border: 1px solid black;">{{ key }}</td>
            <td style="padding: 4px 16px; border-collapse: collapse; border: 1px solid black;">
              <span class="s_textColor__primary" v-if="value === true">{{ value }}</span>
              <span class="s_textColor__info" v-else-if="value === false">{{ JSON.stringify(value) }}</span>
              <span v-else>{{ JSON.stringify(value) }}</span>
            </td>
            <td style="padding: 4px 16px; border-collapse: collapse; border: 1px solid black;" v-if="key === 'mobile'" rowspan="18">
              <ul>
                <li>must use inside component</li>
                <li>values are null before mounted event</li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
    `,
    })
  },
})
