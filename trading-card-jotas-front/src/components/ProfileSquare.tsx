import { TripleBorder, type TripleBorderProps } from "./TripleBorder";

export function ProfileSquare({src, className, borderColor = 'primary-light', reverse = false} : {src: string, className?: string, reverse?: boolean} & Pick<TripleBorderProps, 'borderColor'>) {
  return (
    <TripleBorder borderColor={borderColor} className={`${className} ${reverse ? '-scale-x-100' : ''}`}>
      <img style={{imageRendering: 'pixelated'}} width={80} height={80} src={src}/>
    </TripleBorder>
  )
}