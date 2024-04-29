import { getCleanSetObject } from '@sui/app/lib'

describe('getCleanSetObject', () => {
  test('only returns non nullable/false/undefined values', () => {
    const obj = getCleanSetObject({
      name: 'password',
      max: 16,
      min: undefined,
      ariaLabelledby: null,
      disabled: false,
    })

    expect(obj).toStrictEqual({
      name: 'password',
      max: 16,
    })
  })
})
