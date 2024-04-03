export const pixelBorder = (fill: string, outset = 2, width = 2) => ({
  borderImageSource: `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="${fill}" /></svg>')`,
  borderImageSlice: 2,
  borderImageWidth: 2,
  borderImageOutset: outset,
  borderWidth: 2,
})

export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : null;
}

export const toggleCRT = (callback: (crtOn: boolean) => void) => {
  const body = document.querySelector('body')
  if (!body) return

  body.classList.toggle('crt')
  callback(body.classList.contains('crt'))
}

export type Subtract<T, U> = T & Exclude<T, U>

export type PickEndsWith<T extends object, S extends string> = {
  [K in keyof T as K extends `${infer R}${S}` ? K : never]: T[K]
}

export type StripPrefix<
  TPrefix extends string,
  T extends string, // changed this constraint to string
> = T extends `${TPrefix}.${infer R}` ? R : never;