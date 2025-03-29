import { mount } from '@vue/test-utils'
import { SContainer } from '~/components'

describe('SContainer', () => {
  test('renders correctly', () => {
    const SContainerComponent = mount(<SContainer>Hello World</SContainer>)

    expect(SContainerComponent.html()).toMatchSnapshot()
  })
})
