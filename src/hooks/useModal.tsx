import { TripleBorder } from "@/components/TripleBorder"
import { useMemo } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

const modalAtom = atom({
  key: 'modalAtom',
  default: {open: false}
})

export function useModal() {
  const modalData = useRecoilValue(modalAtom)

  const openModal = useRecoilCallback(({set}) => () => {
    set(modalAtom, (current) => ({...current, open: true}))
  },[])

  const closeModal = useRecoilCallback(({set}) => () => {
    set(modalAtom, (current) => ({...current, open: false}))
  },[])

  const Modal = useMemo(() => (
    !modalData?.open ? <></> : (
      <dialog open style={{backgroundColor: `rgba(0,0,0,60)`}} className="fixed inset-0">
        <TripleBorder>
          <div style={{width: 310, height: 310}}>
            Teste
          </div>
        </TripleBorder>
      </dialog>
    )
  ),[modalData])

  return { Modal, openModal, closeModal }
}