import { FormEvent, useState } from 'react'
import * as Checkbox  from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'

import { api } from '../lib/axios'

const availableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',  'Saturday']

export function NewHabitForm() {

  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  async function createNewHabit(event: FormEvent) {
    event.preventDefault()

    if (!title || weekDays.length === 0) {
      alert('Title and at least one week are required')
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

  function handleToggleWeekDay(weekDay: number) {
    if(weekDays.includes(weekDay)) {
      const weekdaysWithRemovedOne = weekDays.filter(day => day !== weekDay)
      setWeekDays(weekdaysWithRemovedOne)
    } else {
      const weekdaysWithAddedOne = [...weekDays, weekDay]
      setWeekDays(weekdaysWithAddedOne)
    }
  }

  return (
    <form className='w-full flex flex-col p-10' onSubmit={createNewHabit}>
      <label htmlFor='title' className='font-semibold leading-tight'>
        What is your commitment
      </label>
      <input
        type='text'
        id='title'
        placeholder='egs.: Study, Code, Make exercises'
        autoFocus
        className='bg-zinc-800 text-white p-4 mt-3 rounded-lg placeholder:text-zinc-400'
        onChange={event => setTitle(event.target.value)}
        value={title}
      />

      <label htmlFor='' className='mt-4 font-semibold font-leading'>
        What is the recurrence
      </label>

      <div className='mt-3 flex flex-col gap-2'>
        {availableWeekDays.map((weekDay, index) => (
          <Checkbox.Root 
            key={weekDay} 
            className='flex items-center gap-3 group'
            onCheckedChange={() => handleToggleWeekDay(index)}
            checked={weekDays.includes(index)}
          >
            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors'>
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </div>

            <span className=' text-white leading-tight'>{weekDay}</span>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type='submit'
        className='flex items-center justify-center gap-3 mt-6 p-4 rounded-lg font-semibold bg-green-600 hover:bg-green-500 transition-colors'
      >
        <Check size={20} />
        Confirm
      </button>
    </form>
  )
}
