import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder"
import { useMemo } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

const modalAtom = atom<{open: boolean, modalContentProps: TripleBorderProps}>({
  key: 'modalAtom',
  default: {open: false, modalContentProps: {} }
})

export function useModal() {
  const modalData = useRecoilValue(modalAtom)

  const openModal = useRecoilCallback(({set}) => (content?: TripleBorderProps) => {
    set(modalAtom, (current) => ({...current, open: true, modalContentProps: content ?? {}}))
  },[])

  const closeModal = useRecoilCallback(({set}) => () => {
    set(modalAtom, (current) => ({...current, open: false}))
  },[])

  const Modal = useMemo(() => (
    !modalData?.open ? <></> : (
      <dialog id="modal" onMouseDown={(e) => (e.target as HTMLElement).id === "modal" ? closeModal() : null} open className="fixed w-screen h-screen inset-0 bg-[#00000069] flex justify-center items-center">
        <TripleBorder {...modalData.modalContentProps}/>
      </dialog>
    )
  ),[closeModal, modalData])

  return { Modal, openModal, closeModal }
}