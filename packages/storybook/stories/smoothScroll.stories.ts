import { faker } from '@khsura/shared'
import { useScroll } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const smoothScroll: Meta = {
  title: 'UI Directives/SmoothScroll',
}

export default smoothScroll

export const SmoothScroll = createStoryObj({
  render: () => {
    return defineComponent({
      setup() {
        const { smoothScrollTo, scrollIntoView } = useScroll()

        const scrollTargets = [
          {
            name: 'head1 (scrollTo)',
            id: '#head1',
            scrollTo: smoothScrollTo,
          },
          {
            name: 'head2 (scrollTo)',
            id: '#head2',
            scrollTo: smoothScrollTo,
          },
          {
            name: 'head3 (scrollTo)',
            id: '#head3',
            scrollTo: smoothScrollTo,
          },
          {
            name: 'head4 (scrollIntoView)',
            id: '#head4',
            scrollTo: scrollIntoView,
          },
          {
            name: 'head5 (scrollIntoView)',
            id: '#head5',
            scrollTo: scrollIntoView,
          },
        ]

        return {
          scrollTargets,
        }
      },
      template: /* html */ `
      <div style="max-width: 600px; margin: auto; text-align: justify">
        <ul>
          <li v-for="item in scrollTargets" :key="item.id">
            <button @click="item.scrollTo(item.id, { behavior: 'smooth' })">{{ item.name }}</button>
          </li>
        </ul>
        <h2 id="head1" class="s_mt__5">head1</h2>
        <p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>
        <h2 id="head2" class="s_mt__5">head2</h2>
        <p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>
        <h2 id="head3" class="s_mt__5">head3</h2>
        <p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>
        <h2 id="head4" class="s_mt__5">head4</h2>
        <p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>
        <h2 id="head5" class="s_mt__5">head5</h2>
        <p>${faker.lorem.sentences({ min: 1, max: 4 })}</p>
      </div>`,
    })
  },
})
