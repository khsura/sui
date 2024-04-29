/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentPropsAndSlots } from '@storybook/vue3'
import type { FunctionalComponent } from 'vue'

export type ComponentPropsOrProps<TCmpOrArgs> = TCmpOrArgs extends Constructor<any>
  ? ComponentPropsAndSlots<TCmpOrArgs>
  : TCmpOrArgs extends FunctionalComponent<any>
  ? ComponentPropsAndSlots<TCmpOrArgs>
  : TCmpOrArgs

export type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T
