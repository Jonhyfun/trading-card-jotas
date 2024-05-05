import axios from "axios"
import { useEffect } from "react"
import { useQuery } from "react-query"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

export type BackendCard = {
  key: string
  label: string
  value?: number
  desc?: string
  limit: 1 | 2 | 3
  src: string
  ghost?: boolean
}

const cardsAtom = atom<{ cards: BackendCard[], isCardsLoading: boolean }>({
  key: 'cardsAtom',
  default: { cards: [], isCardsLoading: true }
})

export const useCards = () => {
  const cards = useRecoilValue(cardsAtom)

  return cards
}

export const useCardsLoad = () => {
  const { isLoading, error, data } = useQuery<BackendCard[]>('repoData', () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`).then(({ data }) => data),
    {
      staleTime: 1000 * 60 * 60, // 1 hour in ms
      cacheTime: 1000 * 60 * 60, // 1 hour in ms
    })

  const loadCards = useRecoilCallback(({ set }) => (cards: BackendCard[]) => {
    set(cardsAtom, (current) => ({ ...current, cards }))
  }, [])

  const setLoading = useRecoilCallback(({ set }) => (isCardsLoading: boolean) => {
    set(cardsAtom, (current) => ({ ...current, isCardsLoading }))
  }, [])

  useEffect(() => {
    loadCards(data ?? [])
  }, [data, loadCards])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  return {
    cardsLoading: isLoading,
    cards: data
  }
}