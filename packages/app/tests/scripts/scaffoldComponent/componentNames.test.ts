import { toComponentNames } from '../../../scripts/scaffoldComponent/componentNames'

describe('toComponentNames', () => {
  it('derives every spelling from a multi-word name', () => {
    expect(toComponentNames('SkeletonLoader')).toEqual({
      base: 'SkeletonLoader',
      component: 'SSkeletonLoader',
      camel: 'skeletonLoader',
      kebab: 'skeleton-loader',
      propsType: 'PropsSkeletonLoader',
      propsFile: 'propsSkeletonLoader',
      componentFile: 'sSkeletonLoader',
      vueFile: 'sSkeletonLoader.vue',
      cssBlock: 's_skeletonLoader',
    })
  })

  it('accepts the S prefix', () => {
    expect(toComponentNames('SAvatar').component).toBe('SAvatar')
    expect(toComponentNames('Avatar').component).toBe('SAvatar')
  })

  it('keeps a leading S that starts a word', () => {
    expect(toComponentNames('Sparkline').component).toBe('SSparkline')
  })

  it.each(['avatar', 'skeleton-loader', 'Skeleton Loader', ''])('rejects %j', (name) => {
    expect(() => toComponentNames(name)).toThrow()
  })
})
