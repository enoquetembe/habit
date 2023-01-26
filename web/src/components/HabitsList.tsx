import {useState, useEffect} from 'react'
import * as Checkbox  from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { api } from '../lib/axios';
import dayjs from 'dayjs';

interface HabitsListProps {
  date: Date
  onCompletedChange: (completed: number) => void
}

interface HabitInfo {
  possibleHabits: {
    id: string,
    title: string,
    created_at: string
  }[],

  completedHabits: string[]
}

export function HabitsList({date, onCompletedChange }: HabitsListProps) {
  const [habitInfo,  setHabitInfo] = useState<HabitInfo>()

  async function handleHabitToggle(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`)
    
    const isHabitAlreadyCompleted = habitInfo!.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    if(isHabitAlreadyCompleted) {
      completedHabits = habitInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabits = [...habitInfo!.completedHabits, habitId]
    }

    setHabitInfo({
       possibleHabits: habitInfo!.possibleHabits,
       completedHabits,
    })

    onCompletedChange(completedHabits.length)
  }

  useEffect(() => {
    api.get('day', {
      params: {
        date: date.toISOString()
      }
    }).then(response => {
      setHabitInfo(response.data)
    })
  },  [])

  const isDayInPast = dayjs(date).endOf('day').isBefore(new Date())

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {
        habitInfo?.possibleHabits.map(habit => {
          return (
            <Checkbox.Root 
              key={habit.id} 
              onCheckedChange={() => {handleHabitToggle(habit.id)}}
              checked={habitInfo.completedHabits.includes(habit.id)}
              disabled={isDayInPast}
              className='flex items-center gap-3 group'
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors'>
                <Checkbox.Indicator>
                  <Check />
                </Checkbox.Indicator>
              </div>
              <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                {habit.title}
              </span>
            </Checkbox.Root>
          )
        })
      }    
    </div>
  )
}
