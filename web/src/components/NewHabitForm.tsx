import { Check } from 'phosphor-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { FormEvent, useState } from 'react'
import { api } from '../lib/axios'

const availableWeekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function NewHabitForm() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!title || weekDays.length === 0) {
      return
    }

    await api.post('/habits', {
      title,
      weekDays,
    })

    setTitle('')
    setWeekDays([])
    alert('Habit created with success!')
  }

  const handleToogleWeekDays = (weekDayIndex: number) => {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      )
    } else {
      setWeekDays((prevState) => [...prevState, weekDayIndex])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        What is your commitment?
      </label>
      <input
        type="text"
        id="title"
        autoFocus
        value={title}
        placeholder="egs.:, Read a book, Study, Drink 2L of water etc..."
        className="p-4 mt-3 text-white rounded-lg bg-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="" className="mt-4 font-semibold leading-tight">
        What is the recurrence?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox.Root
              onClick={() => handleToogleWeekDays(index)}
              checked={weekDays.includes(index)}
              className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
              key={weekDay}
            >
              <div className="transition-colors flex items-center justify-center w-8 h-8 border-2 rounded-lg bg-zinc-900 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-500 group-focus:ring-offset-2 group-focus:ring-offset-dark">
                <Checkbox.Indicator>
                  <Check width={20} className="text-white" />
                </Checkbox.Indicator>
              </div>
              <span className="leading-tight text-white">{weekDay}</span>
            </Checkbox.Root>
          )
        })}
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-3 p-4 mt-6 font-semibold transition-colors bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        <Check width={20} className="font-bold" />
        Confirm
      </button>
    </form>
  )
}
