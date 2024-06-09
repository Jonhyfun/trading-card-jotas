import { errorToast, successToast } from "@/utils/toast"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { atom, useRecoilCallback, useRecoilValue } from "recoil"

export type ServerCard = {
  cardKey: string
  id: string
  visualEffects?: ('overwritten' | 'copied' | 'ghost')[]
}

type SyncData = {
  stance: 'attack' | 'defense' | 'pending' | null
  hand: ServerCard[]
  cardStack: ServerCard[]
  points: string //? é uma string por que é só um valor x que vem do banco, pode ter um - pode ter algum simbolo vai saber, da pra brincar.
}

export type GameData = {
  gameState: 'waitingForPlayers' | 'running' | 'victory' | 'loss'
  me: SyncData
  otherPlayer: SyncData
}

export const websocketAtom = atom<WebSocket | undefined>({
  key: 'websocketAtom',
  default: undefined
})

const defaultSyncData: SyncData = { stance: null, hand: [], cardStack: [], points: '0' }

export const gameDataAtom = atom<GameData>({
  key: 'gameData',
  default: { gameState: 'waitingForPlayers', me: defaultSyncData, otherPlayer: defaultSyncData }
})

const useOutcomingMessages = () => {
  const saveDeck = useRecoilCallback(({ snapshot }) => async (deck: string[], withMessage = false) => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket!.send(`${withMessage ? 'setCurrentDeckWithMessage' : 'setCurrentDeck'}/${JSON.stringify(deck)}`)
  }, [])

  const placeCard = useRecoilCallback(({ snapshot }) => async (card: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket!.send(`setCard/${card}`)
  }, [])

  const joinRoom = useRecoilCallback(({ snapshot }) => async (room: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    const interval = setInterval(() => {
      socket!.send(`joinRoom/${room}`)
      clearInterval(interval);
    }, 300)
  }, [])

  const leaveRoom = useRecoilCallback(({ snapshot }) => async (room: string) => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket!.send(`leaveRoom/${room}`)
  }, [])

  const fetchHand = useRecoilCallback(({ snapshot }) => async () => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket!.send('fetchHand')
  }, [])

  return { saveDeck, placeCard, leaveRoom, joinRoom, fetchHand }
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

  const setStance = useRecoilCallback(({ set }) => (stance: GameData['me']['stance']) => {
    console.log({ stance })
    set(gameDataAtom, (current) => ({ ...current, me: { ...current.me, stance } }))
  }, [])

  const loadHand = useRecoilCallback(({ set }) => (_hand: string) => {
    const hand = JSON.parse(_hand) as GameData['me']['hand']
    set(gameDataAtom, (current) => ({ ...current, me: { ...current.me, hand } }))
  }, [])

  const syncData = useRecoilCallback(({ set }) => (data: string) => {
    const me = JSON.parse(data) as GameData['me']
    console.log({ me })
    set(gameDataAtom, (current) => ({ ...current, me }))
  }, [])

  const syncOtherPlayerData = useRecoilCallback(({ set }) => (data: string) => {
    const otherPlayer = JSON.parse(data) as GameData['otherPlayer']
    set(gameDataAtom, (current) => ({ ...current, otherPlayer }))
  }, [])

  const joinedRoom = useRecoilCallback(({ snapshot }) => async () => {
    const socket = await snapshot.getPromise(websocketAtom)
    socket!.send('fetchHand')
  }, [])

  const redirect = useCallback((data: string) => {
    router.push(`${router.basePath}${data.replaceAll('-', '/')}`)
  }, [router])

  return {
    success, error, setStance, loadHand, joinedRoom, redirect,
    syncData, syncOtherPlayerData, setGameState, endLosing, endWining
  }
}

export const useGameSocket = () => {
  const socket = useRecoilValue(websocketAtom)
  const gameData = useRecoilValue(gameDataAtom)

  const outcomingMessages = useOutcomingMessages()
  const incomingMessages = useIncomingMessages()

  const lockStance = useRecoilCallback(({ set }) => () => {
    set(gameDataAtom, (current) => ({ ...current, stance: 'pending' as GameData['me']['stance'] }))
  }, [])

  const cleanup = useRecoilCallback(({ set }) => () => {
    set(gameDataAtom, { me: defaultSyncData, otherPlayer: defaultSyncData, gameState: 'waitingForPlayers' as GameData['gameState'] })
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.onmessage = ((ev: MessageEvent<any>) => {
      const [message, ..._data] = ev.data.split('/');
      const data = _data.join('');

      (incomingMessages as any)[message](data as any);
    })
  }, [incomingMessages, socket])

  useEffect(() => {
    return () => {
      cleanup();
    }
  }, [cleanup])

  return {
    ...outcomingMessages,
    lockStance,
    gameData
  }
}