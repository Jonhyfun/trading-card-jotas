import axios from "axios"
import { Card } from "@/components/Card"
import { Layout } from "@/layout"
import { GetServerSideProps } from "next"
import { env } from "process"
import { MouseEvent, useCallback, useState } from "react"
import { TripleBorder } from "@/components/TripleBorder"
import { useSocket } from "@/hooks/useSocket"
import Link from "next/link"

type BackendCard = {
  key: string
  label: string
  value?: number
  limit: 1 | 2 | 3
  src: string
}

type ServerSidePropsResult = { cards: BackendCard[] }

export const getServerSideProps = (async (context) => {
  const cards = (await axios.get(`${env.NEXT_PUBLIC_API_URL}/cards`)).data

  return {
    props: {
      cards
    }
  }
}) satisfies GetServerSideProps<ServerSidePropsResult>

export default function Deck({ cards }: ServerSidePropsResult) {
  const { saveDeck } = useSocket()
  const [addMode, setAddMode] = useState<'add' | 'remove'>();
  const [deck, setDeck] = useState<string[]>([])

  const updateDeck = useCallback((cardKey: string, limit: number, mode: 'add' | 'remove') => {
    if (mode === 'add') {
      if (deck.length === 20) return;
      setDeck((current) => {
        if (current.filter((_cardKey) => _cardKey === cardKey).length === limit) return current;
        return [...current, cardKey];
      });
    } else {
      setDeck((current) => {
        const amount = current.filter((_cardKey) => _cardKey === cardKey).length;
        if (amount <= 0) return current;
        const result = current.filter((_cardKey) => _cardKey !== cardKey);
        for (let i = 0; i < amount - 1; i++) {
          result.push(cardKey);
        }
        return result;
      });
    }
  }, [deck.length]);

  const addCard = useCallback((cardKey: string, limit: number) => {
    if (addMode === 'remove') {
      updateDeck(cardKey, limit, 'remove');
    } else {
      updateDeck(cardKey, limit, 'add');
    }
  }, [addMode, updateDeck]);

  const removeCard = useCallback((e: MouseEvent<HTMLDivElement> | null, cardKey: string, limit: number) => {
    e?.preventDefault();
    updateDeck(cardKey, limit, 'remove');
  }, [updateDeck]);

  const postDeck = useCallback(() => {
    if (deck.length !== 20) return
    saveDeck(deck)
  }, [deck, saveDeck])

  return (
    <Layout>
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex w-full justify-between md:justify-end mb-6">
          <TripleBorder className="md:hidden" onClick={() => setAddMode((current) => (current === 'add' || !current) ? 'remove' : 'add')} borderColor={(addMode === 'add' || !addMode) ? 'primary-light' : 'secondary-light'}>
            <div className="flex items-center gap-1 py-1 px-1.5 w-full">
              <span className="text-xs">Modo:</span>
              <span className="text-xs">{(addMode === 'add' || !addMode) ? 'Adicionar' : 'Remover'}</span>
            </div>
          </TripleBorder>
          <span className="content-center">
            {deck.length}/20
          </span>
        </div>
        <div className="flex flex-wrap gap-4 w-full mx-auto pt-2 md:pt-0 md:overflow-y-visible overflow-y-scroll">
          {(cards.sort((a, b) => (a.value ?? 0) - (b.value ?? 0))).map((card, i) => (
            <div key={`${card.src}-deck-card`} onClick={() => addCard(card.key, card.limit)} onContextMenu={(e) => removeCard(e, card.key, card.limit)} className={`h-[6.75rem] select-none cursor-pointer relative ${deck.filter((cardKey) => cardKey === card.key).length > 0 ? '' : 'opacity-45'}`}>
              {deck.filter((cardKey) => cardKey === card.key).length > 0 && <div className="absolute top-0 right-0 rounded-full flex items-center justify-center w-8 h-8 border-black border-2 bg-white translate-x-1/2 -translate-y-1/4">{deck.filter((cardKey) => cardKey === card.key).length}</div>}
              <Card card={{ borderColor: 'primary-light', id: i.toString(), src: `${env.NEXT_PUBLIC_API_URL}${card.src}` }} className="w-[3.625rem] h-[6.75rem]" />
            </div>
          ))}
        </div>
        <div className="w-full h-full flex items-end justify-start mt-6">
          <TripleBorder borderColor="gray-light" className="select-none h-full w-full">
            <div onClick={postDeck} className={`${deck.length === 20 ? '' : 'pointer-events-none opacity-40'} group px-3 pr-6 py-3 pt-6 w-fit cursor-pointer`}>
              <span className="group-hover:visible invisible mr-1">*</span>
              <span>Salvar</span>
            </div>
            <Link href={"/"} className="group px-3 pr-6 py-5 w-fit cursor-pointer">
              <span className="group-hover:visible invisible mr-1">*</span>
              <span>Cancelar</span>
            </Link>
          </TripleBorder>
        </div>
      </div>
    </Layout>
  )
}