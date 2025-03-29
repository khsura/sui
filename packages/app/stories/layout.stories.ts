import { faker } from '@khsura/shared'
import type { Meta } from '@storybook/vue3'
import { computed, defineComponent, ref } from 'vue'
import {
  SAppBar,
  SAppBarTitle,
  SButton,
  SIcon,
  SLayout,
  SNavigationDrawer,
  SMain,
  SColumn,
  SFooter,
  SBottomNavigation,
  SList,
  SContainer,
  SRow,
  SListItem,
  SListItemIcon,
  SListItemContent,
  SDivider,
  ToolbarDensity,
  useDisplay,
} from '~/index'
import { createStoryObj } from '~/storybook'

type StoryComponent =
  | typeof SLayout
  | typeof SNavigationDrawer
  | typeof SAppBar
  | typeof SMain
  | typeof SFooter
  | { hasAppBar: boolean; hasExtension: boolean }

const layout: Meta<StoryComponent> = {
  title: 'UI Components/Layout',
  argTypes: {
    position: {
      type: 'string',
      control: 'select',
      options: [null, 'fixed', 'absolute'],
    },
    density: {
      type: 'string',
      control: 'select',
      options: [null, ToolbarDensity.default, ToolbarDensity.comfortable, ToolbarDensity.compact],
    },
  },
}

export default layout

export const Layout = createStoryObj<StoryComponent>({
  args: {
    position: null,
    name: 'sample',
    permanent: false,
    miniVariant: false,
    density: 'default',
    hasAppBar: true,
    hasExtension: false,
  },
  // TODO: Sura - fix any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (args: any) => {
    return defineComponent({
      components: {
        SAppBar,
        SAppBarTitle,
        SNavigationDrawer,
        SFooter,
        SBottomNavigation,
        SButton,
        SIcon,
        SLayout,
        SMain,
        SColumn,
        SRow,
        SDivider,
        SList,
        SListItem,
        SListItemIcon,
        SContainer,
        SListItemContent,
      },
      setup() {
        const value = ref(false)
        const { smAndUp } = useDisplay()
        const dummyUrl = faker.internet.url()

        const links = computed(() => {
          return [
            {
              name: `${smAndUp.value ? 'Top' : ''}`,
              href: dummyUrl,
            },
            {
              name: 'Company',
              href: dummyUrl,
            },
            {
              name: 'Privacy',
              href: dummyUrl,
            },
            {
              name: 'Terms',
              href: dummyUrl,
            },
          ]
        })

        return {
          value,
          links,
          menuIcon: 'mdi-menu',
          args,
        }
      },
      template: `
        <sLayout :name="args.name">
          <SAppBar v-if="args.hasAppBar" :for="args.name" :position="args.position" :density="args.density">
            <SButton icon @click="value = !value" id="activator"><SIcon :icon="menuIcon"></SIcon></SButton>
            <SAppBarTitle>surakh.com</SAppBarTitle>
            <template v-if="args.hasExtension" #extension>
              <SButton icon><SIcon icon="mdi-dots-vertical"></SIcon></SButton>
            </template>
          </SAppBar>
          <SNavigationDrawer 
            v-model="value"
            activator="#activator"
            :for="args.name"
            elevation="1"
            :permanent="args.permanent"
            :mini-variant="args.miniVariant"
          >
            <SList>
              <SDivider></SDivider>
              <SListItem link>
                <SListItemIcon>
                  <SIcon icon="mdi-vector-difference-ba"></SIcon>
                </SListItemIcon>
                <SListItemContent>Menu1</SListItemContent>
              </SListItem>
              <SDivider></SDivider>
              <SListItem link>
                <SListItemIcon>
                  <SIcon icon="mdi-image-area"></SIcon>
                </SListItemIcon>
                <SListItemContent>Menu2</SListItemContent>
              </SListItem>
              <SDivider></SDivider>
            </SList>
          </SNavigationDrawer>
          <SMain :for="args.name" class="s_px__2">
            Main Content
          </SMain>
          <SFooter :for="args.name">
            <SContainer>
              <SRow no-gutters style="height: 100%" align="center">
                <SColumn cols="12">
                  <ul class="pl-0 text-body-2">
                    <li
                      v-for="(link, id) in links"
                      :key="id"
                      class="s_display__block k_display--sm__inlineBlock k_mr--sm__5 k_mb__3 k_mb--sm__0"
                    >
                      <a :href="link.href" class="s_text--caption" target="_blank" rel="noopener noreferrer">
                        {{ link.name }}
                      </a>
                    </li>
                  </ul>
                  <div class="s_text--caption k_mt__5 k_mt--sm__2 k_textAlign__center k_textAlign--sm__left">
                    <div>© surakh.com</div>
                  </div>
                </SColumn>
              </SRow>
            </SContainer>
          </SFooter>
          <SBottomNavigation :for="args.name">
            <SButton value="recent">
              <SIcon icon="mdi-history"></SIcon>
              <span>Recent</span>
            </SButton>
            <SButton value="favorites">
              <SIcon icon="mdi-heart"></SIcon>
              <span>Favorites</span>
            </SButton>
            <SButton value="nearby">
              <SIcon icon="mdi-map-marker"></SIcon>
              <span>Nearby</span>
            </SButton>
          </SBottomNavigation>
        </sLayout>
      `,
    })
  },
})
