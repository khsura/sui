import { ref, shallowRef } from 'vue'
import type { PropsMenu, PropsContent } from '@/app/definitions'
import { useMenuService } from '@/app/services'

const defaultPropsContent: PropsContent = {
  contentClass: {},
  contentStyle: {},
}

const defaultProps: PropsMenu = {
  disabled: false,
  readonly: false,
  activator: 'string',
  closeOnClick: false,
  closeOnScroll: false,
  location: null,
  offsetX: 1,
  offsetY: 2,
  position: 'absolute',
  closeOnContentClick: false,
  screenPadding: null,
  ...defaultPropsContent,
}

/* Mocks */
const dummyContentElement = document.createElement('div')

dummyContentElement.style.height = '10'
dummyContentElement.style.width = '20'

const mockGetActivatorLocationResult = new DOMRect(10, 20, 30, 40)

const mockContentElement = {
  value: { offsetWidth: 19, offsetHeight: 21 },
}

vi.mock('@/app/services/core/activatorService', () => {
  const useActivatorService = vi.fn(() => {
    return {
      getActivatorLocation: vi.fn().mockReturnValue(mockGetActivatorLocationResult),
      contentElement: mockContentElement,
    }
  })

  return {
    useActivatorService,
  }
})

vi.mock('@/app/lib/browser', () => {
  const getViewportLocation = vi.fn(() => ({
    left: 1,
    top: 1,
    width: 40,
    height: 40,
    right: 41,
    bottom: 41,
  }))

  return {
    getViewportLocation,
  }
})

vi.mock('@/app/services/positionService', () => {
  const usePositionService = vi.fn(() => ({
    classListPosition: vi.fn().mockReturnValue({ s_position__fixed: true }),
  }))

  return {
    usePositionService,
  }
})

vi.mock('@/app/services/core/contentService', () => {
  const useContentService = vi.fn(() => ({
    styles: {
      value: { border: 'double' },
    },
    classes: {
      value: { myClass: true },
    },
  }))

  return {
    useContentService,
  }
})

const model = ref(false)
const activatorElement = shallowRef<HTMLElement | null>(null)
const contentElement = shallowRef<HTMLElement | null>(null)

describe('useMenuService', () => {
  test('content styles should contain styles from content service', () => {
    const { contentStyles } = useMenuService(defaultProps, model, {
      activatorElement,
      contentElement,
    })

    expect(contentStyles.value.border).toBe('double')
  })

  test('content classes should contain classes from content service', () => {
    const { contentClasses } = useMenuService(defaultProps, model, {
      activatorElement,
      contentElement,
    })

    expect(contentClasses.value.myClass).toBe(true)
  })
})
