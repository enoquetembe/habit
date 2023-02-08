import logoSVG from '../assets/logo.svg'
import { Plus, X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { NewHabitForm } from './NewHabitForm'

export function Header() {
  return (
    <div className='flex items-center justify-between w-full max-w-3xl mx-auto'>
      <img src={logoSVG} alt='Logo' />

      <Dialog.Root>
        <Dialog.Trigger
          type='button'
          className='flex items-center gap-3 px-6 py-4 font-semibold transition-colors border rounded-lg border-violet-500 hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-dark'
        >
          <Plus width={20} className='text-violet-500' />
          New Habit
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='fixed inset-0 w-screen h-screen bg-black/80' />
          <Dialog.Content className='absolute w-full max-w-md p-10 text-white -translate-x-1/2 -translate-y-1/2 bg-zinc-900 rounded-2xl top-1/2 left-1/2'>
            <Dialog.Title className='text-3xl font-extrabold leading-tight'>
              Create habit
            </Dialog.Title>
            <Dialog.Description />
            <Dialog.Close className='absolute rounded-lg right-6 top-6 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900'>
              <X width={24} aria-label='Colse'></X>
            </Dialog.Close>

            <NewHabitForm />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
