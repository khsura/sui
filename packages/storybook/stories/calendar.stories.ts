import { faker } from '@sui/shared'
import { SToolbar, SButton, SIcon, SToolbarTitle, SCalendar } from '@sui/app/components'
import { createStoryObj } from '@sui/storybook/helpers'
import { action } from '@storybook/addon-actions'
import { defineComponent, ref } from 'vue'
import type { CalendarComponent } from '@sui/app/definitions'
import type { CalendarDate, CalendarEvent } from '@sui/app/types'
import type { Meta } from '@storybook/vue3'
import dayjs from '@sui/app/vendors/dayjs'

const calendar: Meta<typeof SCalendar> = {
  title: 'UI Components/Calendar',
  component: SCalendar,
  argTypes: {
    eventColor: {
      type: 'string',
      control: {
        type: 'text',
      },
      table: {
        defaultValue: {
          summary: 'undefined',
        },
        type: {
          summary: '((event: CalendarEvent) => string) | undefined',
        },
      },
    },
  },
}

export default calendar

export const Calendar = createStoryObj<typeof SCalendar>({
  args: {
    type: 'month',
    'onClick:event': action('click:event'),
    'onClick:date': action('click:date'),
    onChange: action('change'),
    eventColor: (event: CalendarEvent) => {
      return event.color
    },
  },
  render: (args) =>
    defineComponent({
      components: { SCalendar, SToolbar, SButton, SToolbarTitle, SIcon },
      setup() {
        const focus = ref('')
        const calendar = ref<CalendarComponent | null>(null)
        const events = ref<CalendarEvent[]>([])
        const colors = ref(['blue', 'indigo', 'purple', 'crimson', 'green', 'orange', 'grey'])
        const names = ref(faker.helpers.uniqueArray(faker.word.noun, 20))

        const getRandomNumber = (range: number, offset: number) => {
          return Math.floor((offset - range + 1) * Math.random()) + range
        }

        const getEvents = ({ start, end }: { start: Pick<CalendarDate, 'date'>; end: Pick<CalendarDate, 'date'> }) => {
          const events: CalendarEvent[] = []
          const min = new Date(`${start.date}T00:00:00`)
          const max = new Date(`${end.date}T23:59:59`)
          const days = (max.getTime() - min.getTime()) / 86400000
          const eventCount = getRandomNumber(days, days + 20)

          for (let i = 0; i < eventCount; i++) {
            const allDay = getRandomNumber(0, 3) === 0
            const firstTimestamp = getRandomNumber(min.getTime(), max.getTime())
            const first = new Date(firstTimestamp - (firstTimestamp % 900000))
            const secondTimestamp = getRandomNumber(2, allDay ? 288 : 8) * 900000
            const second = new Date(first.getTime() + secondTimestamp)

            events.push({
              name: names.value[getRandomNumber(0, names.value.length - 1)],
              start: first,
              end: second,
              color: colors.value[getRandomNumber(0, colors.value.length - 1)],
              timed: !allDay,
            })
          }

          return events
        }

        const updateEvents = ({
          start,
          end,
        }: {
          start: Pick<CalendarDate, 'date'>
          end: Pick<CalendarDate, 'date'>
        }) => {
          events.value = getEvents({ start, end })
        }

        updateEvents({
          start: {
            date: dayjs().startOf('month').format('YYYY-MM-DD'),
          },
          end: {
            date: dayjs().endOf('month').format('YYYY-MM-DD'),
          },
        })

        return {
          args,
          events,
          focus,
          updateEvents,
          calendar,
          arrowLeft: 'mdi-chevron-left',
          arrowRight: 'mdi-chevron-right',
        }
      },
      template: /* html */ `
        <div>
          <SToolbar content-style="justify-content: center;">
            <SButton @click=calendar?.prev() icon size="large">
              <SIcon :icon="arrowLeft" size="large"></SIcon>
            </SButton>
            <div class="s_text--h6 k_fontWeight__bold">${faker.company.buzzNoun()} {{ calendar?.title }}</div>
            <SButton @click="calendar?.next()" icon size="large">
              <SIcon :icon="arrowRight" size="large"></SIcon>
            </SButton>
          </SToolbar>
          <SCalendar
            ref="calendar"
            v-bind="args"
            v-model:focus="focus"
            :events="events"
            @change="updateEvents"
          ></SCalendar>
          <pre style="max-height: 400px; overflow-y: auto;"><code>{{ events }}</code></pre>
        </div>
      `,
    }),
})
