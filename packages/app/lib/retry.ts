import { wait } from '@khsura/sui/lib/wait'

export const retry = async <T>(fn: () => Promise<T | false>, attempts: number, delay: number): Promise<T | false> => {
  for (let i = 0; i < attempts; i++) {
    const result = await fn()

    if (result !== false) {
      return result
    }

    await wait(delay)
  }

  return false
}
