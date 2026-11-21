import { defineConfig } from 'vite'

export default defineConfig({
  // The server-render checks run the bundle in Node, so bundle @khsura/sui and its dependencies
  // instead of leaving them to Node's resolver: the check is about what a bundler makes of the package.
  ssr: { noExternal: true },
})
