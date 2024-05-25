import { SRow, SColumn } from '@khsura/sui/components'
import { type PropsRow } from '@khsura/sui/types'
import { mount } from '@vue/test-utils'

describe('SRow', () => {
  test('renders correctly', () => {
    const SRowComponent = mount(SRow)

    expect(SRowComponent.html()).toMatchSnapshot()
  })

  test('when gap is set, it should ignore the paddings', () => {
    const SRowComponent = mount(
      (props: PropsRow) => (
        <SRow {...props}>
          <SColumn>test</SColumn>
        </SRow>
      ),
      {
        props: {
          gap: 10,
        },
      },
    )

    expect(SRowComponent.find('.s_row__content.s_row__content--noGutters').exists()).toBeTruthy()
  })

  test('when gap is not set, it use default paddings', () => {
    const SRowComponent = mount((props: PropsRow) => (
      <SRow {...props}>
        <SColumn>test</SColumn>
      </SRow>
    ))

    expect(SRowComponent.find('.s_row__content.s_row__content--noGutters').exists()).toBeFalsy()
  })
})
