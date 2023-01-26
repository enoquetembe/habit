interface ProgressBarProps {
  progress: number
}

export function ProgressBar(props: ProgressBarProps) {
  return(
    <div className='w-full h-3 mt-4 rounded-xl bg-zinc-700 transition-all'>
      <div
        role='progressbar'
        aria-label='Completed habit progress on this day'
        aria-valuenow={props.progress}
        className='h-3 rounded-xl bg-violet-600'
        style={{ width: `${props.progress}%`}}
      />
    </div>
  )
}
