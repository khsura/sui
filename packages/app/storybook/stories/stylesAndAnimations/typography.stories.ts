import type { Meta } from '@storybook/vue3-vite'
import { sTypographyDemo } from '@/app/storybook/components'
import { createStoryObj } from '@/app/storybook/helpers'

interface TypographyType {
  text: string
  typographies: Array<{ classAttr: string; name: string }>
  textDecorations: string[]
  textAlignments: string[]
  whiteSpacing: string[]
  textShadowing: string[]
  textTransform: string[]
}

const typography: Meta<TypographyType> = {
  title: 'Styles & Animations/Typography',
}

export default typography

export const Typography = createStoryObj<TypographyType>({
  render: (args) => {
    return {
      components: {
        sTypographyDemo,
      },
      setup() {
        return { args }
      },
      template: '<sTypographyDemo v-bind="args"></sTypographyDemo>',
    }
  },
  args: {
    text: 'SampleText',
    typographies: [
      { classAttr: 's_text--h1', name: 'h1' },
      { classAttr: 's_text--h2', name: 'h2' },
      { classAttr: 's_text--h3', name: 'h3' },
      { classAttr: 's_text--h4', name: 'h4' },
      { classAttr: 's_text--h5', name: 'h5' },
      { classAttr: 's_text--h6', name: 'h6' },
      { classAttr: 's_text--body__1', name: 'body1' },
      { classAttr: 's_text--body__2', name: 'body2' },
      { classAttr: 's_text--caption', name: 'caption' },
      { classAttr: 's_text--overline', name: 'overline' },
      { classAttr: 's_text--subtitle__1', name: 'subtitle__1' },
      { classAttr: 's_text--subtitle__2', name: 'subtitle__2' },
    ],
    textDecorations: [
      's_textDecoration__lineThrough',
      's_textDecoration__none',
      's_textDecoration__overline',
      's_textDecoration__underline',
    ],
    textAlignments: [
      's_textAlign__left',
      's_textAlign__right',
      's_textAlign__center',
      's_textAlign__justify',
      's_textAlign__start',
      's_textAlign__end',
    ],
    whiteSpacing: ['s_text__wrap', 's_text__noWrap', 's_text__pre', 's_text__preLine', 's_text__preWrap'],
    textShadowing: ['s_textShadow__0', 's_textShadow__1', 's_textShadow__2', 's_textShadow__3'],
    textTransform: ['s_text__capitalize', 's_text__lowercase', 's_text__uppercase'],
  },
})
