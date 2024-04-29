import axios from "axios"
import { useEffect } from "react"
import { useQuery } from "react-query"
import { atom, useRecoilCallback } from "recoil"

export type BackendCard = {
  key: string
  label: string
  value?: number
  desc?: string
  limit: 1 | 2 | 3
  src: string
}

const cardsAtom = atom<BackendCard[]>({
  key: 'cardsAtom',
  default: []
})

export const useCards = () => {
  const { isLoading, error, data } = useQuery<BackendCard[]>('repoData', () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cards`).then(({data}) => data))

  const loadCards = useRecoilCallback(({set}) => (cards: BackendCard[]) => {
    set(cardsAtom, () => cards)
  },[])

  useEffect(() => {
    console.log('rodei')
    loadCards(data ?? [])
  },[data, loadCards])

  return {
    cardsLoading: isLoading,
    cards: data
  }
}