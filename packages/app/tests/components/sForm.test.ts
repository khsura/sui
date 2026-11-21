import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SApp, SForm, SInput } from '@/app/components'

const mountForm = (formAttributes = '') =>
  mount(
    defineComponent({
      components: { SApp, SForm, SInput },
      template: `
        <SApp>
          <SForm ${formAttributes} @submit.prevent>
            <SInput id="email" label="Email" type="email" />
          </SForm>
        </SApp>
      `,
    }),
  )

describe('SForm', () => {
  test('turns off native browser validation, so its bubble never covers the SUI error', () => {
    const form = mountForm().find<HTMLFormElement>('form')

    expect(form.attributes('novalidate')).toBeDefined()
    expect(form.element.noValidate).toBe(true)
  })

  test('lets native validation back on with :novalidate="false"', () => {
    const form = mountForm(':novalidate="false"').find<HTMLFormElement>('form')

    expect(form.element.noValidate).toBe(false)
  })
})
