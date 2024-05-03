import Typewriter from 'react-ts-typewriter';
import Link from 'next/link';
import { TripleBorder } from "@/components/TripleBorder";
import { Layout } from '@/layout';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeId } from '@/utils/any';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Home() {
  const router = useRouter()
  const { localDeck } = useLocalStorage()

  const createGame = useCallback(() => {
    const game = makeId(5)
    router.push(`/game/${game}`)
  }, [router])

  return (
    <Layout>
      <div className="pt-8 grid grid-rows-3 w-full h-full">
        <Typewriter cursor={false} text="Trading Card Game do Jotas em breve!" />
        <TripleBorder className="row-span-2" borderColor="gray-light">
          <div className="w-full h-full md:p-5 md:pt-7 p-3 pt-5 flex flex-col gap-6 md:text-base text-xs">
            <Link href="/rooms" className={`${(localDeck && localDeck.length === 20) ? 'group' : 'cursor-auto opacity-40'} cursor-pointer`}><span className="group-hover:visible invisible mr-2">*</span><span>Salas</span></Link>
            <div onClick={createGame} className={`${(localDeck && localDeck.length === 20) ? 'group' : 'cursor-auto opacity-40'} cursor-pointer`}><span className="group-hover:visible invisible mr-2">*</span><span>Nova Partida</span></div>
            <Link href="/deck" className="group cursor-pointer"><div className="group cursor-pointer"><span className="group-hover:visible invisible mr-2">*</span><span>Meus Decks</span></div></Link>
          </div>
        </TripleBorder>
      </div>
    </Layout>
  );
}
