import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { resolveSuiApi } from '../../src/services'
import { latestFixturePath, makeProject, makeTempDir, olderFixturePath } from '../testProject'

describe('resolveSuiApi', () => {
  it('uses SUI_PROJECT_ROOT before the cwd', () => {
    const envProject = makeProject({ fixturePath: olderFixturePath })
    const cwdProject = makeProject({ fixturePath: latestFixturePath })

    const resolved = resolveSuiApi({
      env: { SUI_PROJECT_ROOT: envProject.root },
      cwd: cwdProject.root,
      bundledPath: latestFixturePath,
    })

    expect(resolved.source).toBe('project')
    expect(resolved.path).toBe(envProject.apiPath)
    expect(resolved.api.version).toBe('1.10.0')
  })

  it('walks up from the cwd to the nearest project install', () => {
    const project = makeProject({ fixturePath: olderFixturePath })
    const nestedDir = join(project.root, 'src', 'pages', 'admin')

    mkdirSync(nestedDir, { recursive: true })
    const resolved = resolveSuiApi({ env: {}, cwd: nestedDir, bundledPath: latestFixturePath })

    expect(resolved.source).toBe('project')
    expect(resolved.path).toBe(project.apiPath)
  })

  it('falls back to the bundled copy when no project install is found', () => {
    const resolved = resolveSuiApi({ env: {}, cwd: makeTempDir(), bundledPath: latestFixturePath })

    expect(resolved.source).toBe('bundled')
    expect(resolved.path).toBe(latestFixturePath)
    expect(resolved.api.version).toBe('1.18.3')
    expect(resolved.warning).toBeUndefined()
  })

  it('falls back to the bundled copy with a warning when the project file is invalid', () => {
    const project = makeProject({ contents: '{"package":"@khsura/sui"}' })
    const resolved = resolveSuiApi({ env: {}, cwd: project.root, bundledPath: latestFixturePath })

    expect(resolved.source).toBe('bundled')
    expect(resolved.warning).toContain(project.apiPath)
  })

  it('throws when neither a project install nor the bundled copy exists', () => {
    const emptyDir = makeTempDir()

    expect(() => resolveSuiApi({ env: {}, cwd: emptyDir, bundledPath: join(emptyDir, 'missing.json') })).toThrow(
      /bundled copy is missing/,
    )
  })
})
