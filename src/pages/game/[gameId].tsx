import { StackedCards } from "@/components/StackedCards";
import { useModal } from "@/hooks/useModal";
import { Layout } from "@/layout";
import { useEffect } from "react";

export default function Game() {
  const {openModal} = useModal()

  useEffect(() => {
    openModal()
  },[openModal])

  return (
    <Layout>
      <StackedCards cardContentClassNameOverwrite="w-12 h-16 pt-1" gutterMultiplication={25} reverse/>
    </Layout>
  )
}