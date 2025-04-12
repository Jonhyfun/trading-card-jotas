export function TextPreviewIcon() {
  return (
    <div className="flex flex-col gap-px w-full px-2 pt-1">
      {Array.from({length: 5}).map((_,i) => (
        <div key={`faketext-${i}`} className="w-full h-[0.063rem] bg-black"/>
      ))}
    </div>
  )
}