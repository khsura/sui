import type { ComponentPublicInstance } from 'vue'
import { type SForm } from '@/app/components'
import type { PropsCalendar, PropsInput, PropsSelect } from '@/app/definitions'
import type { CalendarEvent } from '@/app/types'

export type CalendarComponent = ComponentPublicInstance<PropsCalendar<CalendarEvent>>
export type FormComponent = InstanceType<typeof SForm>
export type InputComponent = ComponentPublicInstance<PropsInput>
export type SelectComponent = ComponentPublicInstance<PropsSelect>
