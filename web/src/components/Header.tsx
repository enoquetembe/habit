import logo from '../assets/logo.svg'
import { Plus } from 'phosphor-react'

export function Header() {
  return(
    <header className='w-full max-w-3xl m-auto flex justify-between items-center' >
     <img src={logo} alt="logo" />
      <button 
        type='button'
        className='flex items-center gap-3 px-6 py-4 border border-violet-500 rounded-lg hover:border-violet-300'
      >
        <Plus className='text-violet-500'/> New habit
      </button>
    </header>
  )
}
