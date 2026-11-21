import type { CompilerError, SourceLocation } from '@vue/compiler-dom'
import { parse as parseFragment } from '@vue/compiler-dom'
import { parse as parseSfc } from '@vue/compiler-sfc'
import type { ParsedTemplate, TemplateParseError } from '../types'

const FIRST_POSITION = { line: 1, column: 1 }

const toParseError = (error: CompilerError | SyntaxError): TemplateParseError => {
  const location: SourceLocation | undefined = 'loc' in error ? error.loc : undefined

  return {
    line: location?.start.line ?? FIRST_POSITION.line,
    column: location?.start.column ?? FIRST_POSITION.column,
    message: error.message,
  }
}

/**
 * Parses a full SFC (its `<template>` block) or a bare template fragment into the Vue template AST.
 * Positions in the AST and in `errors` are relative to `source` either way.
 */
export const parseVueTemplate = (source: string): ParsedTemplate => {
  const { descriptor, errors: sfcErrors } = parseSfc(source)
  const isSfc = Boolean(descriptor.template ?? descriptor.script ?? descriptor.scriptSetup)

  if (isSfc) {
    return { root: descriptor.template?.ast ?? null, errors: sfcErrors.map(toParseError) }
  }

  const fragmentErrors: TemplateParseError[] = []
  const root = parseFragment(source, { onError: (error) => fragmentErrors.push(toParseError(error)) })

  return { root, errors: fragmentErrors }
}
