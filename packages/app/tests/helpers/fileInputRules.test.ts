import { formatFileSize, getFileInputRules, getFilesOfValue, getIsFileAccepted } from '../../helpers/fileInputRules'

const createFile = (name: string, type = '', size = 1) => new File(['x'.repeat(size)], name, { type })

const runRules = (rules: ReturnType<typeof getFileInputRules>, value: File[] | null) =>
  rules.map((rule) => rule(value)).filter((outcome) => outcome !== true)

describe('formatFileSize', () => {
  test.each([
    [0, '0 B'],
    [512, '512 B'],
    [1024, '1 KB'],
    [1536, '1.5 KB'],
    [5 * 1024 * 1024, '5 MB'],
    [1.25 * 1024 * 1024 * 1024, '1.3 GB'],
    [-1, '0 B'],
  ])('%d bytes is %s', (bytes, text) => {
    expect(formatFileSize(bytes)).toBe(text)
  })
})

describe('getIsFileAccepted', () => {
  test('an empty accept takes every file', () => {
    expect(getIsFileAccepted(createFile('a.exe'))).toBe(true)
    expect(getIsFileAccepted(createFile('a.exe'), ' ')).toBe(true)
  })

  test('matches extensions case-insensitively, MIME types and MIME families', () => {
    expect(getIsFileAccepted(createFile('Report.XLSX'), '.csv, .xlsx')).toBe(true)
    expect(getIsFileAccepted(createFile('report.pdf'), '.csv,.xlsx')).toBe(false)
    expect(getIsFileAccepted(createFile('photo', 'image/png'), 'image/*')).toBe(true)
    expect(getIsFileAccepted(createFile('clip', 'video/mp4'), 'image/*')).toBe(false)
    expect(getIsFileAccepted(createFile('doc', 'application/pdf'), 'application/pdf')).toBe(true)
    expect(getIsFileAccepted(createFile('doc', 'application/json'), 'application/pdf')).toBe(false)
  })
})

describe('getFilesOfValue', () => {
  test('keeps only files and treats any other value as no files', () => {
    const file = createFile('a.csv')

    expect(getFilesOfValue([file])).toEqual([file])
    expect(getFilesOfValue(null)).toEqual([])
    expect(getFilesOfValue('a.csv')).toEqual([])
    expect(getFilesOfValue(['a.csv'])).toEqual([])
  })
})

describe('getFileInputRules', () => {
  test('no options, no rules', () => {
    expect(getFileInputRules({})).toEqual([])
  })

  test('required fails on null and an empty list', () => {
    const rules = getFileInputRules({ required: true })

    expect(runRules(rules, null)).toEqual(['Choose a file.'])
    expect(runRules(rules, [])).toEqual(['Choose a file.'])
    expect(runRules(rules, [createFile('a.csv')])).toEqual([])
  })

  test('maxSize names the first file that is too large', () => {
    const rules = getFileInputRules({ maxSize: 5 * 1024 * 1024 })

    expect(runRules(rules, [createFile('small.csv', '', 10)])).toEqual([])
    expect(runRules(rules, [createFile('huge.csv', '', 5 * 1024 * 1024 + 1)])).toEqual([
      'huge.csv is larger than 5 MB.',
    ])
    expect(runRules(rules, null)).toEqual([])
  })

  test('accept names the first file of another type', () => {
    const rules = getFileInputRules({ accept: '.csv,.xlsx' })

    expect(runRules(rules, [createFile('a.csv'), createFile('b.xlsx')])).toEqual([])
    expect(runRules(rules, [createFile('a.csv'), createFile('b.pdf')])).toEqual([
      'b.pdf is not an accepted file type (.csv,.xlsx).',
    ])
  })

  test('maxFiles limits the count', () => {
    const rules = getFileInputRules({ maxFiles: 2 })

    expect(runRules(rules, [createFile('a'), createFile('b')])).toEqual([])
    expect(runRules(rules, [createFile('a'), createFile('b'), createFile('c')])).toEqual([
      'Choose at most 2 files (3 chosen).',
    ])
  })

  test('custom messages replace the English texts', () => {
    const rules = getFileInputRules({
      required: true,
      maxSize: 1,
      messages: {
        required: () => 'Файл сонгоно уу.',
        tooLarge: (file, maxSizeText) => `${file.name}: ${maxSizeText}-аас их`,
        wrongType: undefined,
      },
    })

    expect(runRules(rules, null)).toEqual(['Файл сонгоно уу.'])
    expect(runRules(rules, [createFile('a.csv', '', 2)])).toEqual(['a.csv: 1 B-аас их'])
  })

  test('a file name is HTML-escaped, because the error line renders HTML', () => {
    const rules = getFileInputRules({ maxSize: 1 })

    expect(runRules(rules, [createFile('<img src=x onerror=alert(1)>.png', '', 2)])).toEqual([
      '&lt;img src=x onerror=alert(1)&gt;.png is larger than 1 B.',
    ])
  })
})
