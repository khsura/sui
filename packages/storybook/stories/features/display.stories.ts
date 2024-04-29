import { useDisplayService } from '@sui/app/services/displayService'
import { createStoryObj } from '@sui/storybook/helpers'
import { defineComponent, computed } from 'vue'
import type { Meta } from '@storybook/vue3'

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
          xs,
          xsOnly,
          sm,
          smAndDown,
          smAndUp,
          smOnly,
          md,
          mdAndDown,
          mdAndUp,
          mdOnly,
          lg,
          lgAndDown,
          lgAndUp,
          lgOnly,
          xl,
          xlOnly,
          name,
          mobile,
        } = useDisplayService()

        const displayProperties = computed(() => {
          return {
            mobile: mobile.value,
            xs: xs.value,
            xsOnly: xsOnly.value,
            smAndDown: smAndDown.value,
            sm: sm.value,
            smOnly: smOnly.value,
            smAndUp: smAndUp.value,
            mdAndDown: mdAndDown.value,
            md: md.value,
            mdOnly: mdOnly.value,
            mdAndUp: mdAndUp.value,
            lgAndDown: lgAndDown.value,
            lg: lg.value,
            lgOnly: lgOnly.value,
            lgAndUp: lgAndUp.value,
            xl: xl.value,
            xlOnly: xlOnly.value,
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
