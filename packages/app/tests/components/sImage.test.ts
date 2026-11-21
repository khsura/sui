import { SImage } from '@/app/components'
import { type PropsImage } from '@/app/definitions'
import { mountWithApp } from '@/app/tests/_helpers'

const imageSource = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='
const aspectRatio = 4 / 3

describe('SImage', () => {
  const getSImage = (props?: Partial<PropsImage>) => {
    return mountWithApp(SImage, { props: { src: imageSource, ...props } })
  }

  test('sizes itself from the width when an aspect ratio is given', () => {
    const wrapper = getSImage({ aspectRatio })

    expect(wrapper.classes('s_image--aspectRatio')).toBe(true)
  })

  test('keeps an explicit height over the aspect ratio', () => {
    const wrapper = getSImage({ aspectRatio, height: 200 })

    expect(wrapper.classes('s_image--aspectRatio')).toBe(false)
  })
})
