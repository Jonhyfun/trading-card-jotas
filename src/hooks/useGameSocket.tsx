import { errorToast, successToast } from "@/utils/toast"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

type ServerCard = {
  card: string
  id: string
}

type GameData = {
  stance: 'attack' | 'defense' | 'pending' | null
  hand: ServerCard[]
}

const websocketAtom = atom({
  key: 'websocketAtom',
  default: new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!)
})

const gameDataAtom = atom<GameData>({
  key: 'gameData',
  default: {stance: null, hand: []}
})

const useOutcomingMessages = () => {
  const saveDeck = useRecoilCallback(({snapshot}) => async (deck: string[], withMessage = false) => {
    const socket = await snapshot.getPromise(websocketAtom)
    if(socket.OPEN) {
      socket.send(`${withMessage ? 'setCurrentDeckWithMessage' : 'setCurrentDeck'}/${JSON.stringify(deck)}`)
    }
  },[])

  const setCard = useRecoilCallback(({snapshot}) => async (card: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    if(socket.OPEN) {
      socket.send(`setCard/${card}`)
    }
  },[])

  const joinRoom = useRecoilCallback(({snapshot}) => async (room: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    const interval = setInterval(() => {
      console.log('rodei?')
      if(socket.OPEN) {
        socket.send(`joinRoom/${room}`)
        clearInterval(interval);
      }
    },300)
  },[])

  const fetchHand = useRecoilCallback(({snapshot}) => async () => {
    const socket = await snapshot.getPromise(websocketAtom)
    console.log(`fetchei`)
    socket.send('fetchHand')
  },[])
  
  return { saveDeck, setCard, joinRoom, fetchHand }
}

const useIncomingMessages = () => {
  const router = useRouter()

  const success = useCallback((data: string) => {
    successToast(data)
  },[])

  const error = useCallback((data: string) => {
    errorToast(data)
  },[])

  const setStance = useRecoilCallback(({set}) => (stance: GameData['stance']) => {
    set(gameDataAtom, (current) => ({...current, stance}))
  },[])

  const loadHand = useRecoilCallback(({set}) => (_hand: string) => {
    const hand = JSON.parse(_hand) as GameData['hand']
    set(gameDataAtom, (current) => ({...current, hand}))
  },[])

  const joinedRoom = useRecoilCallback(({snapshot}) => async () => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket.send('fetchHand')
  },[])

  const redirect = useCallback((data: string) => {
    router.push(data.replaceAll('-','/'))
  },[router])

  return { success, error, setStance, loadHand, joinedRoom, redirect }
}

export const useGameSocket = () => {
  const socket = useRecoilValue(websocketAtom)
  const gameData = useRecoilValue(gameDataAtom)

  const { joinRoom, saveDeck, setCard } = useOutcomingMessages()
  const incomingMessages = useIncomingMessages()

  const lockStance = useRecoilCallback(({set}) => () => {
    set(gameDataAtom, (current) => ({...current, stance: 'pending' as GameData['stance']}))
  },[])

  useEffect(() => {
    socket.onmessage = ((ev: MessageEvent<any>) => {
      const [message, ..._data] = ev.data.split('/');
      const data = _data.join('');

      console.log({ message, data });

      (incomingMessages as any)[message](data as any);
    })
  },[incomingMessages, socket])

  return {
    saveDeck,
    joinRoom,
    lockStance,
    setCard,
    gameData
  }
}