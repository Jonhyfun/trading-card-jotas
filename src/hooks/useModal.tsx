import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder"
import { useMemo } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

const modalAtom = atom<{ open: boolean, modalContentProps: TripleBorderProps, ignoreBorder?: boolean }>({
  key: 'modalAtom',
  default: { open: false, modalContentProps: {}, ignoreBorder: false }
})

export function useModal() {
  const modalData = useRecoilValue(modalAtom)

  const openModal = useRecoilCallback(({ set }) => (content?: TripleBorderProps & { ignoreBorder?: boolean }) => {
    set(modalAtom, (current) => ({ ...current, open: true, ignoreBorder: content?.ignoreBorder, modalContentProps: content ?? {} }))
  }, [])

  const closeModal = useRecoilCallback(({ set }) => () => {
    set(modalAtom, (current) => ({ ...current, open: false }))
  }, [])

  const Modal = useMemo(() => (
    !modalData?.open ? <></> : (
      <dialog id="modal" onMouseDown={(e) => (e.target as HTMLElement).id === "modal" ? closeModal() : null} open className="fixed z-50 w-screen h-screen inset-0 bg-[#00000069] flex justify-center items-center">
        {!modalData.ignoreBorder && <TripleBorder {...modalData.modalContentProps} />}
        {modalData.ignoreBorder && <div {...modalData.modalContentProps}></div>}
      </dialog>
    )
  ), [closeModal, modalData])

  return { Modal, openModal, closeModal }
}