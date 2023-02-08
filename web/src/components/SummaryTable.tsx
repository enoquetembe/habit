import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { weekDays } from '../utils/constants'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import SummaryItem from './SummaryItem'
import { WeekDay } from './WeekDay'

const summaryDates = generateDatesFromYearBeginning()
const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

export interface ISummary {
  id: string
  date: string
  completed: number
  amount: number
}

let timeoutId: number | null

export function SummaryTable() {
  const [summary, setSummary] = useState<ISummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSummary = async () => {
    try {
      const res = await api.get<ISummary[]>('/summary')
      setSummary(res.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    timeoutId = setTimeout(() => {
      fetchSummary()
    }, 500)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
  }, [])

  return (
    <div className='flex w-full'>
      <div className='grid grid-rows-7 grid-flow-row gap-3'>
        {weekDays.map((weekDay, index) => (
          <WeekDay label={weekDay} key={index} />
        ))}
      </div>

      {loading ? null : (
        <div className='grid grid-rows-7 grid-flow-col gap-3 '>
          {summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, 'day')
            })

            return (
              <SummaryItem
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            )
          })}

          {Array.from({ length: amountOfDaysToFill }).map((_, index) => (
            <SummaryItem key={index} future />
          ))}
        </div>
      )}
    </div>
  )
}

export default SummaryTable
