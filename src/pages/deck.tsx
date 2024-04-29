import Link from "next/link"
import { Card } from "@/components/Card"
import { Layout } from "@/layout"
import { MouseEvent, useCallback, useEffect, useState } from "react"
import { LightColors, TripleBorder } from "@/components/TripleBorder"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { errorToast } from "@/utils/toast"
import { BackendCard, useCards } from "@/hooks/useCards"
import { CardData } from "@/components/StackedCards"
import { useModal } from "@/hooks/useModal"

const addModes = {
  'add': 'Adicionar',
  'remove': 'Remover',
  'info': 'Info',
}

const addModesColors: {[key in keyof typeof addModes]: LightColors} = {
  'add': 'primary-light',
  'remove': 'secondary-light',
  'info': 'gray-light',
}

export default function Deck() {
  const { openModal } = useModal()
  const { postLocalDeck, localDeck } = useLocalStorage()
  const [addMode, setAddMode] = useState<(keyof typeof addModes)[]>(['add', 'info', 'remove']);
  const [deck, setDeck] = useState<string[]>([])
  const { cards, cardsLoading } = useCards()

  useEffect(() => {
    console.log({cards})
  },[cards])

  useEffect(() => {
    console.log({addMode})
  },[addMode])

  const toggleAddMode = useCallback(() => {
    setAddMode((current) => {
      const result = [...current]
      result.unshift(result.pop()!)
      return result
    })
  },[])

  const updateDeck = useCallback((cardKey: string, limit: number, mode: 'add' | 'remove' | 'info') => {
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

    //TODO hookar
    const handleCardInfo = useCallback((card: CardData & BackendCard) => {
      openModal({
        borderColor: card.borderColor,
        children: (
          <div className="w-[16rem] h-[20rem] p-2 pt-4 flex flex-col items-center gap-5 bg-gray">
            <TripleBorder borderColor="gray-light">
              <div className="w-32 h-32 bg-bg-internal flex justify-center items-center text-2xl">
                <img className="w-full h-full" style={{imageRendering: 'pixelated'}} src={card.src}/>
              </div>
            </TripleBorder>
            <TripleBorder className="w-full" borderColor="gray-light">
              <span className="text-xs p-3 w-full h-[6.75rem] overflow-y-auto block leading-5 bg-bg-internal text-black">
                {card.desc}
              </span>
            </TripleBorder>
          </div>
        )
      })
    },[openModal])

  const addCard = useCallback((card: CardData & BackendCard) => {
    if(addMode[0] === 'info') {
      handleCardInfo({...card, src: `${process.env.NEXT_PUBLIC_API_URL}${card.src}`})
      return
    }

    if (addMode[0] === 'remove') {
      updateDeck(card.key, card.limit, 'remove');
    } else {
      updateDeck(card.key, card.limit, 'add');
    }
  }, [addMode, handleCardInfo, updateDeck]);

  const removeCard = useCallback((e: MouseEvent<HTMLDivElement> | null, cardKey: string, limit: number) => {
    e?.preventDefault();
    updateDeck(cardKey, limit, 'remove');
  }, [updateDeck]);

  const postDeck = useCallback(() => {
    if(deck.length !== 20) return errorToast('Selecione 20 cartas!')
    postLocalDeck(deck, true)
  },[deck, postLocalDeck])

  useEffect(() => {
    if(localDeck && localDeck.length === 20) {
      setDeck(localDeck)
    }
  },[localDeck])

  return (
    <Layout>
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex w-full justify-between md:justify-end mb-6">
          <TripleBorder className="mr-auto select-none cursor-pointer" onClick={toggleAddMode} borderColor={addModesColors[addMode[0]]}>
            <div className="flex items-center gap-1 py-1 px-1.5 w-full">
              <span className="text-xs">Modo:</span>
              <span className="text-xs">{addModes[addMode[0]]}</span>
            </div>
          </TripleBorder>
          <span className="content-center text-sm md:text-base">
            {deck.length}/20
          </span>
        </div>
        <div className="flex flex-wrap gap-4 w-full mx-auto pt-2 md:pt-0 md:overflow-y-visible overflow-y-scroll">
          {cardsLoading ? [] : ([...cards!].sort((a, b) => (a.value ?? 0) - (b.value ?? 0))).map((card, i) => (
            <div key={`${card.key}-deck-card`} onClick={() => addCard(card)} onContextMenu={(e) => removeCard(e, card.key, card.limit)} className={`h-[6.75rem] select-none cursor-pointer relative ${deck.filter((cardKey) => cardKey === card.key).length > 0 ? '' : 'opacity-45'}`}>
              {deck.filter((cardKey) => cardKey === card.key).length > 0 && <div className="absolute top-0 right-0 rounded-full flex items-center justify-center w-8 h-8 border-black border-2 bg-white translate-x-1/2 -translate-y-1/4">{deck.filter((cardKey) => cardKey === card.key).length}</div>}
              <Card card={{  ...card, borderColor: 'primary-light', id: i.toString(), src: `${process.env.NEXT_PUBLIC_API_URL}${card.src}`}} className="w-[3.625rem] h-[6.75rem]" />
            </div>
          ))}
        </div>
        <div className="w-full h-full flex items-end justify-start mt-6">
          <TripleBorder borderColor="gray-light" className="select-none h-full w-full">
            <div onClick={postDeck} className={`${deck.length === 20 ? 'group' : 'cursor-auto opacity-40'} px-3 pr-6 py-3 pt-6 w-fit cursor-pointer`}>
              <span className="group-hover:visible invisible mr-1">*</span>
              <span>Salvar</span>
            </div>
            <Link href={"/"} className="group px-3 pr-6 py-5 w-fit cursor-pointer">
              <span className="group-hover:visible invisible mr-1">*</span>
              <span>Voltar</span>
            </Link>
          </TripleBorder>
        </div>
      </div>
    </Layout>
  )
}