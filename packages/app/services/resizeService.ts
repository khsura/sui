export const useResizeService = (onResize: (event: Event) => void) => {
  const bindResizer = () => {
    window.addEventListener('resize', onResize)
  }

  const unbindResizer = () => {
    window.removeEventListener('resize', onResize)
  }

  return {
    bindResizer,
    unbindResizer,
  }
}
