import { SContainer } from '@khsura/sui/components'
import { mount } from '@vue/test-utils'

describe('SContainer', () => {
  test('renders correctly', () => {
    const SContainerComponent = mount(<SContainer>Hello World</SContainer>)

    expect(SContainerComponent.html()).toMatchSnapshot()
  })
})
