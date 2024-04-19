import { useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import { atom, useRecoilValue } from "recoil"

const websocketAtom = atom({
  key: 'websocketAtom',
  default: new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!)
})

export const useSocket = () => {
  const socket = useRecoilValue(websocketAtom)

  const saveDeck = useCallback((deck: string[]) => {
    console.log(socket, 'rodei')
    if(socket.OPEN) {
      socket.send(`setCurrentDeck/${JSON.stringify(deck)}`)
    }
  },[socket])

  const joinRoom = useCallback((room: string) => {
    socket.send(`joinRoom/${room}`)
  },[socket])

  useEffect(() => {
    socket.onmessage = ((ev: MessageEvent<any>) => {
      const [message, ..._data] = ev.data.split('/')
      const data = _data.join('')

      if(message === 'success') {
        toast(data)
      }
    })
  },[socket])

  return {
    saveDeck,
    joinRoom
  }
}