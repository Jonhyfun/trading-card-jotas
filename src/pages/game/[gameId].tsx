import { StackedCards } from "@/components/StackedCards";
import { Layout } from "@/layout";

export default function Game() {
  return (
    <Layout>
      <StackedCards gutterMultiplication={25} reverse/>
    </Layout>
  )
}