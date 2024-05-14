import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { pixelBorder } from '@/utils/any'

export function Input({ className, state, ...inputProps }: { state?: [string, Dispatch<SetStateAction<string>>] } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...inputProps}
      className={`focus:shadow-[inset_black_0px_0px_0px_2px] ${className}`}
      style={{ ...inputProps.style, ...pixelBorder('black'), padding: '0.188rem 0.325rem', WebkitAppearance: 'none', outline: 'none' }}
      value={state?.[0]}
      onChange={!state?.[1] ? undefined : (e) => state[1](e.target.value)}
    />
  )
}