import { useActivePopupState } from '@sui/app/reactives/activePopupState'
import { uniqueId } from 'lodash'

describe('Active Popup State', () => {
  beforeEach(() => {
    const activePopupState = useActivePopupState()

    activePopupState.state.value.activeStack = []
  })

  describe('pop', () => {
    test('pop should remove only the last id from the stack', () => {
      const id1 = uniqueId()
      const id2 = uniqueId()
      const activePopupState = useActivePopupState()

      activePopupState.push(id1)
      activePopupState.push(id2)

      expect(activePopupState.peek()).toBe(id2)
      activePopupState.pop()
      expect(activePopupState.peek()).toBe(id1)
    })

    test('pop should not error if no ids in the stack', () => {
      const activePopupState = useActivePopupState()

      activePopupState.pop()

      expect(activePopupState.state.value.activeStack.length).toBe(0)
    })
  })

  describe('push', () => {
    test('push should add an id to the top of the stack', () => {
      const id = uniqueId()
      const activePopupState = useActivePopupState()

      activePopupState.push(id)

      expect(activePopupState.peek()).toBe(id)
    })

    test('push should add ids in the correct order when called multiple times', () => {
      const id1 = uniqueId()
      const id2 = uniqueId()
      const activePopupState = useActivePopupState()

      activePopupState.push(id1)

      expect(activePopupState.peek()).toBe(id1)

      activePopupState.push(id2)

      expect(activePopupState.peek()).toBe(id2)
    })
  })

  describe('peek', () => {
    test('peek should return the id from the top of the stack', () => {
      const id = '999'
      const activePopupState = useActivePopupState()

      expect(activePopupState.state.value.activeStack.length).toBe(0)
      activePopupState.push(id)

      expect(activePopupState.peek()).toBe(id)
    })
  })

  describe('delete', () => {
    test('delete should remove the provided id from the stack', () => {
      const id1 = '777'
      const id2 = '888'
      const activePopupState = useActivePopupState()

      activePopupState.push(id1)
      activePopupState.push(id2)

      expect(activePopupState.peek()).toBe(id2)

      activePopupState.deleteFromStack(id1)

      expect(activePopupState.peek()).toBe(id2)
      expect(activePopupState.state.value.activeStack.length).toBe(1)
    })

    test('delete should not change the stack or error if id does not exist', () => {
      const id = '666'
      const activePopupState = useActivePopupState()

      activePopupState.push(id)

      activePopupState.deleteFromStack('1')

      expect(activePopupState.peek()).toBe(id)
    })
  })
})
