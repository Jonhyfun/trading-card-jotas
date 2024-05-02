import { errorToast, successToast } from "@/utils/toast"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

type ServerCard = {
  cardKey: string
  id: string
}

export type GameData = { //TODO atualizar todos esses num único incoming (eu não sou burro só tava com pressa pra ter o primeiro MVP)
  stance: 'attack' | 'defense' | 'pending' | null
  gameState: 'waitingForPlayers' | 'running' | 'victory' | 'loss'
  hand: ServerCard[]
  myStack: ServerCard[] //TODO um objeto de my e other ao invez de varias props "repetidas"
  otherStack: ServerCard[]
  visualEffects: ('overwritten')[]
  otherVisualEffects: ('overwritten')[]
  myPoints: string //? é uma string por que é só um valor x que vem do banco, pode ter um - pode ter algum simbolo vai saber, da pra brincar.
  otherPoints: string //? é uma string por que é só um valor x que vem do banco, pode ter um - pode ter algum simbolo vai saber, da pra brincar.
}

const websocketAtom = atom({
  key: 'websocketAtom',
  default: new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!)
})

const gameDataAtom = atom<GameData>({
  key: 'gameData',
  default: { stance: null, gameState: 'waitingForPlayers', hand: [], myStack: [], otherStack: [], myPoints: '0', otherPoints: '0', visualEffects: [], otherVisualEffects: [] } //TODO depois o back juntar tudo? mesmo que de mentira, só pro front acessar um objeto no lugar de varios arrays
})

const useOutcomingMessages = () => {
  const saveDeck = useRecoilCallback(({ snapshot }) => async (deck: string[], withMessage = false) => {
    const socket = await snapshot.getPromise(websocketAtom)
    if (socket.OPEN) {
      socket.send(`${withMessage ? 'setCurrentDeckWithMessage' : 'setCurrentDeck'}/${JSON.stringify(deck)}`)
    }
  }, [])

  const placeCard = useRecoilCallback(({ snapshot }) => async (card: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    if (socket.OPEN) {
      socket.send(`setCard/${card}`)
    }
  }, [])

  const joinRoom = useRecoilCallback(({ snapshot }) => async (room: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    const interval = setInterval(() => {
      if (socket.OPEN) {
        socket.send(`joinRoom/${room}`)
        clearInterval(interval);
      }
    }, 300)
  }, [])

  const fetchHand = useRecoilCallback(({ snapshot }) => async () => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket.send('fetchHand')
  }, [])

  return { saveDeck, placeCard, joinRoom, fetchHand }
}

const useIncomingMessages = () => {
  const router = useRouter()

  const success = useCallback((data: string) => {
    successToast(data)
  }, [])

  const error = useCallback((data: string) => {
    errorToast(data)
  }, [])

  const setGameState = useRecoilCallback(({ set }) => (data: string) => {
    set(gameDataAtom, (current) => ({ ...current, gameState: data as GameData['gameState'] }))
  }, [])

  const endLosing = useRecoilCallback(({ set }) => (data: string) => {
    set(gameDataAtom, (current) => ({ ...current, gameState: 'loss' as GameData['gameState'] }))
    error(data)
  }, [error])

  const endWining = useRecoilCallback(({ set }) => (data: string) => {
    set(gameDataAtom, (current) => ({ ...current, gameState: 'victory' as GameData['gameState'] }))
    success(data)
  }, [success])

  const setStance = useRecoilCallback(({ set }) => (stance: GameData['stance']) => {
    set(gameDataAtom, (current) => ({ ...current, stance }))
  }, [])

  const loadHand = useRecoilCallback(({ set }) => (_hand: string) => {
    const hand = JSON.parse(_hand) as GameData['hand']
    set(gameDataAtom, (current) => ({ ...current, hand }))
  }, [])

  const loadMyStack = useRecoilCallback(({ set }) => (_myStack: string) => {
    const myStack = JSON.parse(_myStack) as GameData['myStack']
    set(gameDataAtom, (current) => ({ ...current, myStack }))
  }, [])

  const loadOtherStack = useRecoilCallback(({ set }) => (_otherStack: string) => {
    const otherStack = JSON.parse(_otherStack) as GameData['otherStack']
    set(gameDataAtom, (current) => ({ ...current, otherStack }))
  }, [])

  const loadVisualEffects = useRecoilCallback(({ set }) => (_visualEffects: string) => {
    const visualEffects = JSON.parse(_visualEffects) as GameData['visualEffects']
    set(gameDataAtom, (current) => ({ ...current, visualEffects }))
  }, [])

  const loadOtherVisualEffects = useRecoilCallback(({ set }) => (_otherVisualEffects: string) => {
    const otherVisualEffects = JSON.parse(_otherVisualEffects) as GameData['otherVisualEffects']
    set(gameDataAtom, (current) => ({ ...current, otherVisualEffects }))
  }, [])

  const loadMyPoints = useRecoilCallback(({ set }) => (_myPoints: string) => {
    const myPoints = JSON.parse(_myPoints) as GameData['myPoints']
    set(gameDataAtom, (current) => ({ ...current, myPoints }))
  }, [])

  const loadOtherPoints = useRecoilCallback(({ set }) => (_otherPoints: string) => {
    const otherPoints = JSON.parse(_otherPoints) as GameData['otherPoints']
    set(gameDataAtom, (current) => ({ ...current, otherPoints }))
  }, [])

  const joinedRoom = useRecoilCallback(({ snapshot }) => async () => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket.send('fetchHand')
  }, [])

  const redirect = useCallback((data: string) => {
    router.push(data.replaceAll('-', '/'))
  }, [router])

  return {
    success, error, setStance, loadHand, joinedRoom, redirect,
    loadMyStack, loadOtherStack, loadMyPoints, loadOtherPoints,
    loadVisualEffects, loadOtherVisualEffects,
    setGameState, endLosing, endWining
  }
}

export const useGameSocket = () => {
  const socket = useRecoilValue(websocketAtom)
  const gameData = useRecoilValue(gameDataAtom)

  const { joinRoom, saveDeck, placeCard } = useOutcomingMessages()
  const incomingMessages = useIncomingMessages()

  const lockStance = useRecoilCallback(({ set }) => () => {
    set(gameDataAtom, (current) => ({ ...current, stance: 'pending' as GameData['stance'] }))
  }, [])

  useEffect(() => {
    socket.onmessage = ((ev: MessageEvent<any>) => {
      const [message, ..._data] = ev.data.split('/');
      const data = _data.join('');

      (incomingMessages as any)[message](data as any);
    })
  }, [incomingMessages, socket])

  return {
    saveDeck,
    joinRoom,
    lockStance,
    placeCard,
    gameData
  }
}