import { HabitDay } from "./HabitDay"
import {generateDateFromYearBeginning} from '../utils/generate-date-from-year-beginning'

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const summaryDates= generateDateFromYearBeginning()

const minimumSummaryDateSize = 18*7
const amountToFill = minimumSummaryDateSize - summaryDates.length

export function SummaryTable() {
  return(
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {
          weekDays.map((weekDay, i) => {
            return <div key={`${weekDay}-${i}`} className="text-zinc-400 text-xl font-bold h-10 w-10 flex justify-center items-center">
              {weekDay}
              </div>
          })
        }
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {
          summaryDates.map(date => <HabitDay key={date.toString()} />)
        }

        {
          amountToFill > 0 && Array.from({length: amountToFill}).map((_, i) => {
            return (
              <div 
                key={i} 
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            )
          })
        }
      </div>
    </div>
  )
}
