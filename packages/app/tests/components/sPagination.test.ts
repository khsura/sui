import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { SApp, SPagination } from '@/app/components'
import { type PropsPagination } from '@/app/definitions'
import { mountWithApp } from '@/app/tests/_helpers'

describe('SPagination', () => {
  const getSPagination = (props?: Partial<PropsPagination>) => {
    return mountWithApp(SPagination, { props: { length: 10, ...props } })
  }

  const pageLabels = (wrapper: ReturnType<typeof getSPagination>) => {
    return wrapper.findAll('.s_pagination__slot').map((slot) => slot.text())
  }

  test('renders a nav landmark with an accessible name', () => {
    const wrapper = getSPagination()

    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.classes('s_pagination')).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('Pagination')
    expect(wrapper.find('ul.s_pagination__list').exists()).toBe(true)
  })

  test('lets the landmark and button names be translated', () => {
    const wrapper = getSPagination({
      ariaLabel: 'Хуудаслалт',
      pageAriaLabel: 'Хуудас',
      prevAriaLabel: 'Өмнөх',
      nextAriaLabel: 'Дараах',
      firstAriaLabel: 'Эхний',
      lastAriaLabel: 'Сүүлийн',
      showFirstLastPage: true,
    })

    expect(wrapper.attributes('aria-label')).toBe('Хуудаслалт')
    expect(wrapper.find('.s_pagination__item').attributes('aria-label')).toBe('Хуудас 1')
    expect(wrapper.find('.s_pagination__prev').attributes('aria-label')).toBe('Өмнөх')
    expect(wrapper.find('.s_pagination__next').attributes('aria-label')).toBe('Дараах')
    expect(wrapper.find('.s_pagination__first').attributes('aria-label')).toBe('Эхний')
    expect(wrapper.find('.s_pagination__last').attributes('aria-label')).toBe('Сүүлийн')
  })

  test('marks only the current page with aria-current="page"', () => {
    const wrapper = getSPagination({ modelValue: 3 })
    const current = wrapper.findAll('[aria-current="page"]')

    expect(current).toHaveLength(1)
    expect(current[0]?.text()).toBe('3')
    expect(current[0]?.attributes('aria-label')).toBe('Page 3')
    expect(current[0]?.classes('s_pagination__item--active')).toBe(true)
  })

  test('gives every button an accessible name', () => {
    const wrapper = getSPagination({ showFirstLastPage: true })

    wrapper.findAll('button').forEach((button) => {
      expect(button.attributes('aria-label')).toBeTruthy()
    })
  })

  test('shows every page when they fit in totalVisible', () => {
    const wrapper = getSPagination({ length: 5 })

    expect(pageLabels(wrapper)).toEqual(['', '1', '2', '3', '4', '5', ''])
  })

  test('replaces hidden pages with a hidden-from-screen-readers ellipsis', () => {
    const wrapper = getSPagination({ length: 20, modelValue: 10 })
    const ellipses = wrapper.findAll('.s_pagination__ellipsis')

    expect(pageLabels(wrapper)).toEqual(['', '1', '…', '9', '10', '11', '…', '20', ''])
    expect(ellipses).toHaveLength(2)
    ellipses.forEach((ellipsis) => expect(ellipsis.attributes('aria-hidden')).toBe('true'))
  })

  test('totalVisible sets the number of page slots', () => {
    const wrapper = getSPagination({ length: 20, modelValue: 10, totalVisible: 9 })

    expect(wrapper.findAll('.s_pagination__item, .s_pagination__ellipsis')).toHaveLength(9)
  })

  test('emits update:modelValue when a page is clicked', async () => {
    const wrapper = getSPagination({ modelValue: 1 })

    await wrapper.findAll('.s_pagination__item')[2]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  test('does not emit when the current page is clicked', async () => {
    const wrapper = getSPagination({ modelValue: 2 })

    await wrapper.find('[aria-current="page"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  test('steps with the previous and next buttons', async () => {
    const wrapper = getSPagination({ modelValue: 5 })

    await wrapper.find('.s_pagination__next').trigger('click')
    await wrapper.find('.s_pagination__next').trigger('click')
    await wrapper.find('.s_pagination__prev').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[6], [7], [6]])
  })

  test('jumps with the first and last buttons', async () => {
    const wrapper = getSPagination({ modelValue: 5, showFirstLastPage: true })

    await wrapper.find('.s_pagination__last').trigger('click')
    await wrapper.find('.s_pagination__first').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[10], [1]])
  })

  test('hides the first and last buttons by default', () => {
    const wrapper = getSPagination()

    expect(wrapper.find('.s_pagination__first').exists()).toBe(false)
    expect(wrapper.find('.s_pagination__last').exists()).toBe(false)
  })

  test('disables previous on the first page and next on the last page', () => {
    const first = getSPagination({ modelValue: 1, showFirstLastPage: true })
    const last = getSPagination({ modelValue: 10, showFirstLastPage: true })

    expect(first.find('.s_pagination__prev').attributes('disabled')).toBeDefined()
    expect(first.find('.s_pagination__first').attributes('disabled')).toBeDefined()
    expect(first.find('.s_pagination__next').attributes('disabled')).toBeUndefined()
    expect(last.find('.s_pagination__next').attributes('disabled')).toBeDefined()
    expect(last.find('.s_pagination__last').attributes('disabled')).toBeDefined()
  })

  test('disabled turns off every button', () => {
    const wrapper = getSPagination({ modelValue: 2, disabled: true })

    wrapper.findAll('button').forEach((button) => {
      expect(button.attributes('disabled')).toBeDefined()
    })
    expect(wrapper.classes('s_pagination--disabled')).toBe(true)
  })

  test('clamps an out-of-range modelValue', () => {
    const wrapper = getSPagination({ modelValue: 99 })

    expect(wrapper.find('[aria-current="page"]').text()).toBe('10')
  })

  test('renders no page buttons for a zero length', () => {
    const wrapper = getSPagination({ length: 0 })

    expect(wrapper.findAll('.s_pagination__item')).toHaveLength(0)
    expect(wrapper.find('.s_pagination__next').attributes('disabled')).toBeDefined()
  })

  test('colours the current page with color (primary by default)', () => {
    const primary = getSPagination({ modelValue: 2 })
    const success = getSPagination({ modelValue: 2, color: 'success' })

    expect(primary.find('[aria-current="page"]').classes('s_backgroundColor__primary')).toBe(true)
    expect(success.find('[aria-current="page"]').classes('s_backgroundColor__success')).toBe(true)
    expect(success.find('.s_pagination__item:not([aria-current])').classes('s_button--text')).toBe(true)
  })

  test('can change the size', () => {
    const wrapper = getSPagination({ size: 'large' })

    expect(wrapper.classes('s_pagination--size__large')).toBe(true)
    expect(wrapper.find('.s_pagination__next').classes('s_button--size__large')).toBe(true)
  })

  test('compact hides the first and last buttons and shows at most 5 slots', () => {
    const wrapper = getSPagination({ length: 20, modelValue: 10, compact: true, showFirstLastPage: true })

    expect(wrapper.classes('s_pagination--compact')).toBe(true)
    expect(wrapper.find('.s_pagination__first').exists()).toBe(false)
    expect(pageLabels(wrapper)).toEqual(['', '1', '…', '10', '…', '20', ''])
  })

  test('the theme prop sets the theme class', () => {
    const wrapper = getSPagination({ theme: 'dark' })

    expect(wrapper.classes('s_dark')).toBe(true)
  })

  test('works with v-model', async () => {
    const wrapper = mount(
      defineComponent({
        components: { SApp, SPagination },
        setup() {
          const page = ref(1)

          return { page }
        },
        template: `<SApp><SPagination v-model="page" :length="5" /><output>{{ page }}</output></SApp>`,
      }),
    )

    await wrapper.find('.s_pagination__next').trigger('click')
    await nextTick()

    expect(wrapper.find('output').text()).toBe('2')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
  })

  test('follows modelValue changes from the parent', async () => {
    const page = ref(1)

    const wrapper = mount(
      defineComponent({
        components: { SApp, SPagination },
        setup() {
          return { page }
        },
        template: `<SApp><SPagination :model-value="page" :length="5" /></SApp>`,
      }),
    )

    page.value = 4
    await nextTick()

    expect(wrapper.find('[aria-current="page"]').text()).toBe('4')
  })

  test('works without v-model', async () => {
    const wrapper = getSPagination()

    await wrapper.find('.s_pagination__next').trigger('click')

    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
  })
})
