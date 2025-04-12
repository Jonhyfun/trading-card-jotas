import { Loading } from "@/components/Loading";
import { TripleBorder } from "@/components/TripleBorder";
import { Layout } from "@/layout";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Rooms() {
  const [rooms, setRooms] = useState<{ playerCount: number, room: string }[]>()

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/rooms`).then((response) => setRooms(response.data))
    }, 2000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Layout>
      <div className="w-full h-full flex flex-col gap-5 px-4 py-5">
        <div className="w-full px-1 text-lg">
          Salas:
        </div>
        <TripleBorder borderColor="gray-light" className="w-full h-[95%]">
          {!rooms ? <Loading /> : (
            <div className="grid grid-cols-3 gap-4 gap-x-0 w-full max-h-full overflow-y-auto px-4 py-5">
              {rooms.map(({ playerCount, room }) => (
                <React.Fragment key={`room-${room}`}>
                  <Link href={`/game/${room}`} className="contents group cursor-pointer text-xs sm:text-base">
                    <span className="col-span-2 p-px pr-0 group-hover:p-0 group-hover:pl-[0.938rem] group-hover:border-b-[1px] group-hover:border-l-[1px] group-hover:border-t-[1px] pl-4">Sala {room}</span>
                    <span className="text-center p-px pl-0 group-hover:p-0 group-hover:border-b-[1px] group-hover:border-r-[1px] group-hover:border-t-[1px]">{playerCount}/2</span>
                  </Link>
                  <div className="col-span-3 bg-black h-px"></div>
                </React.Fragment>
              ))}
            </div>
          )}
        </TripleBorder>
      </div>
    </Layout>
  )
}