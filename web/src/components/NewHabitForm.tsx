import * as Checkbox  from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'

const availableWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',  'Saturday']

export function NewHabitForm() {
  return (
    <form className='w-full flex flex-col p-10 '>
      <label htmlFor='title' className='font-semibold leading-tight'>
        What is your commitment
      </label>
      <input
        type='text'
        id='title'
        placeholder='egs.: Study, Code, Make exercises'
        autoFocus
        className='bg-zinc-800 text-white p-4 mt-3 rounded-lg placeholder:text-zinc-400'
      />

      <label htmlFor='' className='mt-4 font-semibold font-leading'>
        What is the recurrence
      </label>

      <div className='mt-3 flex flex-col gap-2'>
        {availableWeekDays.map((weekday) => (
          <Checkbox.Root className='flex items-center gap-3 group'>
            <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50'>
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </div>

            <span className=' text-white leading-tight'>{weekday}</span>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type='submit'
        className='flex items-center justify-center gap-3 mt-6 p-4 rounded-lg font-semibold bg-green-600 hover:bg-green-500'
      >
        <Check size={20} />
        Confirm
      </button>
    </form>
  )
}
