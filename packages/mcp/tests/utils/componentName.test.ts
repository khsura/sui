import { candidateComponentKeys, humanizeComponentName, toComponentKey } from '../../src/utils'

describe('componentName', () => {
  it('builds a separator-free lowercase key', () => {
    expect(toComponentKey(' S-Navigation_Drawer ')).toBe('snavigationdrawer')
  })

  it('tries the name as typed, then with the S prefix', () => {
    expect(candidateComponentKeys('switch')).toEqual(['switch', 'sswitch'])
  })

  it('humanizes component names', () => {
    expect(humanizeComponentName('SNavigationDrawer')).toBe('Navigation drawer')
  })
})
