import { Check } from 'phosphor-react'

export function NewHabitForm() {
  return (
    <form className='w-full flex flex-col p-10 '>
      <label htmlFor='title' className='font-semibold leading-tight'>What is your commitment</label>
      <input 
        type='text' 
        id='title'
        placeholder='egs.: Study, Code, Make exercises'
        autoFocus
        className='bg-zinc-800 text-white p-4 mt-3 rounded-lg placeholder:text-zinc-400'
      />

      <label htmlFor='' className='mt-4 font-semibold font-leading'> what is the recurrence</label>
      
      <button 
        type='submit'
        className='flex items-center justify-center gap-3 mt-6 p-4 rounded-lg font-semibold bg-green-600 hover:bg-green-500'
      >
        <Check size={20}/>
        Confirm      
      </button>
    </form>
  )
}
