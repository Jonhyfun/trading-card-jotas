import { pixelBorder } from '@/utils/any'

export function Loading({ text = 'Carregando' }: { text?: string }) {
  return (
    <div className='flex gap-5 loading-dots items-center justify-center w-full h-full animate-appear'>
      <span>{text}</span>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={`loading-${i}`} style={{ ...pixelBorder('black') }} className='w-px h-px mt-1 rounded-full'></div>
      ))}
    </div>
  )
}