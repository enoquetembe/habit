import logo from '../assets/logo.svg'
import { Plus, X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { NewHabitForm } from './NewHabitForm'

export function Header() {
  return(
    <header className='w-full max-w-3xl m-auto flex justify-between items-center' >
     <img src={logo} alt='logo' />

      <Dialog.Root>
        <Dialog.Trigger 
          type='button'
          className='flex items-center gap-3 px-6 py-4 border border-violet-500 rounded-lg hover:border-violet-300 transition-colors'
        >
          <Plus className='text-violet-500'/> New habit
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className='bg-black/80 inset-0 fixed w-screen h-screen'/>

          <Dialog.Content className='w-full max-w-md bg-zinc-900 p-10 absolute top-1/2 left-1/2 rounded-2xl -translate-x-1/2 -translate-y-1/2'>
            <Dialog.Close className='absolute right-6 top-6 text-zinc-400 hover:text-zinc-200'>
              <X size={24} aria-label='Close'/> 
            </Dialog.Close>
            
            <Dialog.DialogTitle className='text-3xl font-extrabold leading-tight'>
              Create habit
            </Dialog.DialogTitle>

            <NewHabitForm/>
          </Dialog.Content>
        </Dialog.Portal>
        
      </Dialog.Root>
    </header>
  )
}
