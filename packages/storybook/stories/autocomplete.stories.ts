import { SAutocomplete } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { defineComponent, ref } from 'vue'
import { argsAutocomplete } from '@khsura/storybook/args'
import { createStoryObj } from '@khsura/storybook/helpers'
import type { SelectItem } from '@khsura/sui/types'
import { faker, wait } from '@khsura/shared'

const autocomplete: Meta<typeof SAutocomplete> = {
  title: 'UI Components/Autocomplete',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: SAutocomplete as any,
  argTypes: {
    multiple: {
      control: {
        type: 'boolean',
      },
    },
    chips: {
      control: {
        type: 'boolean',
      },
    },
    closableChips: {
      control: {
        type: 'boolean',
      },
    },
    divided: {
      control: {
        type: 'boolean',
      },
    },
    filterMode: {
      control: {
        type: 'select',
      },
      table: {
        type: {
          summary: "'start' | 'contains' | 'exact' | undefined",
        },
      },
      options: [undefined, 'start', 'contains', 'exact'],
    },
  },
}

export default autocomplete

export const Autocomplete = createStoryObj<Meta>({
  args: argsAutocomplete,
  render: (args) =>
    defineComponent({
      components: {
        SAutocomplete,
      },
      setup: () => {
        const modelValue = ref<string | null>(null)

        const createLorem = () => {
          return faker.lorem.paragraphs()
        }

        return {
          args,
          modelValue,
          createLorem,
        }
      },
      template: /* html */ `
        <div>
          <div v-html="createLorem()"></div>
          <SAutocomplete v-bind="args" v-model="modelValue" autocomplete="off"></SAutocomplete>
          <div v-html="createLorem()"></div>
          <pre>{{ JSON.stringify(modelValue, null, 2) }}</pre>
        </div>
      `,
    }),
})

export const WithObjects = createStoryObj<Meta>({
  args: {
    ...argsAutocomplete,
    items: [
      { text: 'John Doe', value: 'john', disabled: false },
      { text: 'Jane Smith', value: 'jane', disabled: false },
      { text: 'Bob Johnson', value: 'bob', disabled: true },
      { text: 'Alice Brown', value: 'alice', disabled: false },
      { text: 'Charlie Wilson', value: 'charlie', disabled: false },
    ],
    placeholder: 'Search users...',
    returnObject: true,
  },
  render: (args) =>
    defineComponent({
      components: {
        SAutocomplete,
      },
      setup: () => {
        const modelValue = ref<SelectItem | null>(null)

        return {
          args,
          modelValue,
        }
      },
      template: /* html */ `
        <SAutocomplete v-bind="args" v-model="modelValue"></SAutocomplete>
      `,
    }),
})

const { items: _items, ...loadingArgs } = argsAutocomplete

export const Loading = createStoryObj<Meta>({
  args: {
    ...loadingArgs,
    loading: true,
    loadingText: 'Fetching data...',
    placeholder: 'Loading items...',
  },
  render: (args) =>
    defineComponent({
      components: {
        SAutocomplete,
      },
      setup: () => {
        const loading = ref(false)
        const modelValue = ref<string | null>(null)
        const items = ref<string[]>([])

        const searchItem = async (queryText: string) => {
          loading.value = true
          await wait(2000)
          items.value = argsAutocomplete.items?.filter((item) => item.toLowerCase().includes(queryText.toLowerCase()))
          loading.value = false
        }

        void searchItem('')

        return {
          args,
          modelValue,
          searchItem,
          items,
          loading,
        }
      },
      template: /* html */ `
        <SAutocomplete
          v-bind="args"
          :loading="loading"
          filter-mode="none"
          v-model="modelValue"
          :items="items"
          @search-item="searchItem"
        ></SAutocomplete>
      `,
    }),
})

export const CustomFilter = createStoryObj<Meta>({
  args: {
    ...argsAutocomplete,
    items: [
      'React',
      'Vue.js',
      'Angular',
      'Svelte',
      'Next.js',
      'Nuxt.js',
      'Express.js',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'Java',
      'C#',
      'Go',
      'Rust',
    ],
    placeholder: 'Search technologies...',
    filter: (item: SelectItem, queryText: string) => {
      return item.text.includes(queryText) && item.text.startsWith(queryText)
    },
  },
  render: (args) =>
    defineComponent({
      components: {
        SAutocomplete,
      },
      setup: () => {
        const modelValue = ref<string | null>(null)

        return {
          args,
          modelValue,
        }
      },
      template: /* html */ `
        <SAutocomplete v-bind="args" v-model="modelValue"></SAutocomplete>
      `,
    }),
})

export const MultipleAutocompletes = createStoryObj<Meta>({
  args: {
    ...argsAutocomplete,
  },
  render: (args) =>
    defineComponent({
      components: {
        SAutocomplete,
      },
      setup: () => {
        const modelValue1 = ref<string | null>('Apple')
        const modelValue2 = ref<string | null>(null)
        const modelValue3 = ref<string | null>(null)
        const items1 = ref<string[]>(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'])
        const items2 = ref<string[]>([1, 2, 3, 4, 5].map(() => faker.animal.type()))
        const items3 = ref<string[]>([1, 2, 3, 4, 5].map(() => faker.company.name()))

        return {
          args,
          modelValue1,
          modelValue2,
          modelValue3,
          items1,
          items2,
          items3,
        }
      },
      template: /* html */ `
        <div>
          <SAutocomplete v-bind="args" v-model="modelValue1" :items="items1"></SAutocomplete>
          <SAutocomplete v-bind="args" v-model="modelValue2" :items="items2"></SAutocomplete>
          <SAutocomplete v-bind="args" v-model="modelValue3" :items="items3"></SAutocomplete>
        </div>
      `,
    }),
})
