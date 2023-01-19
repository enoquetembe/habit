import './styles/global.css'

import { Habit } from './components/Habit'
import { Header } from './components/Header'

export function App() {

  return (
   <div className='w-screen h-screen flex items-center justify-center'>
    <div className='w-full max-w-5xl p-6 flex flex-col gap-16'>
      <Header/>
    </div>
   </div>
  )
}
