import { useMemo } from "react";
import { atom, useAtom, useSetAtom } from "jotai";
import { TripleBorder, TripleBorderProps } from "@/components/TripleBorder";

const modalAtom = atom<{ open: boolean; modalContentProps: TripleBorderProps }>(
  {
    open: false,
    modalContentProps: {},
  }
);

const openModalAtom = atom(null, (get, set, content?: TripleBorderProps) => {
  set(modalAtom, {
    open: true,
    modalContentProps: content ?? {},
  });
});

const closeModalAtom = atom(null, (get, set) => {
  set(modalAtom, {
    ...get(modalAtom),
    open: false,
  });
});

export function useModal() {
  const [modalData] = useAtom(modalAtom);
  const openModal = useSetAtom(openModalAtom);
  const closeModal = useSetAtom(closeModalAtom);

  const Modal = useMemo(
    () =>
      !modalData?.open ? null : (
        <dialog
          id="modal"
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).id === "modal") closeModal();
          }}
          open
          className="fixed z-50 w-screen h-screen inset-0 bg-[#00000069] flex justify-center items-center"
        >
          <TripleBorder {...modalData.modalContentProps} />
        </dialog>
      ),
    [modalData, closeModal]
  );

  return { Modal, openModal, closeModal };
}
