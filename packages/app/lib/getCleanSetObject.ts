type PropsRequired<T> = { [K in keyof T]: NonNullable<T[K]> }

export const getCleanSetObject = <T extends Record<string, unknown>>(target: T): Partial<PropsRequired<T>> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const output: any = { ...target }

  Object.entries(target).forEach(([key, value]) => {
    if (value === undefined || value === false || value === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete output[key]
    }
  })

  return output
}
