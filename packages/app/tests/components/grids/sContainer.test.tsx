import { mount } from '@vue/test-utils'
import { SApp, SContainer } from '@/app/components'

describe('SContainer', () => {
  test('renders correctly', () => {
    const SContainerComponent = mount(
      <SApp>
        <SContainer>Hello World</SContainer>
      </SApp>,
    )

    expect(SContainerComponent.html()).toMatchSnapshot()
  })
})
