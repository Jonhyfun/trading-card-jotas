import { toast } from "react-toastify"

export const errorToast = (content: string) => {
  toast(
    <div className="w-full h-16">
      <div className="p-3 h-full flex gap-3 items-center text-red-600">
        <span className="font-bold ml-1.5">X</span>
        <span className="text-xs">{content ?? ''}</span>
      </div>
    </div>
  )
}

export const successToast = (content: string) => {
  toast(
    <div className="w-full h-16">
      <div className="p-3 h-full flex gap-3 items-center text-green-700">
        <svg className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z" fill="currentColor"></path></svg>
        <span className="text-xs">{content ?? ''}</span>
      </div>
    </div>
  )
}