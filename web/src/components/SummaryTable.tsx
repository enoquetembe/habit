import { HabitDay } from "./HabitDay"

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function SummaryTable() {
  return(
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {
          weekDays.map((weekDay, i) => {
            return <div key={i}  className="text-zinc-400 text-xl font-bold h-10 w-10 flex justify-center items-center">
              {weekDay}
              </div>
          })
        }
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
        <HabitDay/>
      </div>
    </div>
  )
}
