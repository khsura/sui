import { mount } from '@vue/test-utils'
import { useClickOutsideService } from '@khsura/sui/services'
import { ref } from 'vue'

const simpleComponent = {
  template: /* html */ `
  <div>
    <p id="counter">{{counter}}</p>
    <button @click="increment">Click Me</button>
  </div>
  `,
  data() {
    return {
      counter: 0,
    }
  },
  methods: {
    increment() {
      // @ts-expect-error 'this' is scoped to increment instead of component
      this.counter++
    },
  },
}

describe('useClickOutsideService', () => {
  test('Calling register should add our provided event listener', async () => {
    const div = document.createElement('div')
    let isEventListenerCalled = false

    div.id = 'root'
    document.body.appendChild(div)

    const wrapper = mount(simpleComponent, {
      attachTo: '#root',
    })

    const listener = (_data: { isOutside: boolean }, _event: Event) => {
      isEventListenerCalled = true
    }

    const { onClick } = useClickOutsideService()
    const { register } = onClick(ref(wrapper.vm), listener)

    register()

    await wrapper.find('button').trigger('click')
    expect(isEventListenerCalled).toBe(true)
  })

  test('Calling deregister should remove our provided event listener', async () => {
    const div = document.createElement('div')
    let isEventListenerCalled = false

    div.id = 'root'
    document.body.appendChild(div)

    const wrapper = mount(simpleComponent, {
      attachTo: '#root',
    })

    const listener = (_data: { isOutside: boolean }, _event: Event) => {
      isEventListenerCalled = !isEventListenerCalled
    }

    const { onClick } = useClickOutsideService()
    const { register, unregister } = onClick(ref(wrapper.vm), listener)

    register()
    await wrapper.find('button').trigger('click')
    expect(isEventListenerCalled).toBe(true)

    unregister()
    await wrapper.find('button').trigger('click')
    expect(isEventListenerCalled).toBe(true)
  })
})
