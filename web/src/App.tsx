import './styles/global.css'

import { Habit } from './components/Habit'

export function App() {

  return (
   <div>
    <Habit completed={10}/>
    <Habit completed={3}/>
    <Habit completed={1}/>
    <Habit completed={20}/>
   </div>
  )
}
