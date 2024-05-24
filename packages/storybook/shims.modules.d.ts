declare module 'postcss-media-minmax' {
  import type postcss from 'postcss'
  const plugin: () => postcss.AcceptedPlugin

  export default plugin
}
