/**
 * Returns an inline `<script>` body that applies the persisted color mode to
 * `<html data-theme>` before hydration, preventing a flash of the wrong theme.
 *
 * Inject the returned string into `<head>` (e.g. a Nuxt `app.head` script child,
 * or a raw `<script>` in `index.html`). It reads the global localStorage key
 * that `useColorMode` writes (`sui-theme`) and resolves `'auto'` via matchMedia.
 *
 * @example
 * // index.html
 * <script>{{ getThemeHeadScript() }}</script>
 */
export const getThemeHeadScript = (): string => {
  return `(function(){try{var p=localStorage.getItem('sui-theme');var m=(p&&p!=='auto')?p:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',m);}catch(e){}})();`
}
