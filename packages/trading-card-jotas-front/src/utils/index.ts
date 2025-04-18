export const pixelBorder = (fill: string, outset = 2, width = 2) => ({
  borderImageSource: `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="${fill}" /></svg>')`,
  borderImageSlice: 2,
  borderImageWidth: 2,
  borderImageOutset: outset,
  borderWidth: 2,
});

export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`
    : null;
};

export const makeId = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const toggleCRT = (callback: (crtOn: boolean) => void) => {
  const body = document.querySelector("body");
  if (!body) return;

  body.classList.toggle("crt");
  callback(body.classList.contains("crt"));
};

export type Subtract<T, U> = T & Exclude<T, U>;

export type PickEndsWith<T extends object, S extends string> = {
  [K in keyof T as K extends `${infer R}${S}` ? K : never]: T[K];
};

export type StripPrefix<
  TPrefix extends string,
  T extends string, // changed this constraint to string
> = T extends `${TPrefix}.${infer R}` ? R : never;

//? Os tons são diferentes e não mais claros/escuros para simular as limitações de um gameboy

export const Palette = {
  "bg-internal": "#e0e0c0",
  "bg-external": "#7d82a4",

  primary: "#2db36b",
  "primary-light": "#00d0cc",

  secondary: "#d00004",
  "secondary-light": "#b32d75",

  gray: "#848479",
  "gray-light": "#c2c2a6",
};

// export const mockCards: Omit<CardType, 'borderColor'>[] = [
//   {
//     id: '1',
//     src: 'http://localhost/cardImage/two.png',
//   },
//   {
//     id: '2',
//     src: 'http://localhost/cardImage/minus.png',
//   },
//   {
//     id: '3',
//     src: 'http://localhost/cardImage/x.png',
//   },
//   {
//     id: '4',
//     src: 'http://localhost/cardImage/exclamation.png',
//   },
//   {
//     id: '5',
//     src: 'http://localhost/cardImage/interrogation.png',
//   },
// ]
