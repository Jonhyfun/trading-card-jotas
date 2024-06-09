import { makeId } from "@/utils";
import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react"

const Draggable = ({ initialPosition, onDrop, destroy }: { initialPosition: DOMRect, onDrop: () => void, destroy: () => void }) => {
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const onMouseUp = (e: MouseEvent) => {
      onDrop()
      destroy()
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
    const onMouseMove = (e: MouseEvent) => {
      window.requestAnimationFrame((currentFrame: DOMHighResTimeStamp) => {
        if (!draggableRef.current) return
        if (frame !== 0 && currentFrame < frame + 15) return; //TODO algum jeito de animar talvez o transition, talvez um remotion durante esses buffered frames 
        frame = currentFrame;
        draggableRef.current.style.left = `${e.clientX}px`;
        draggableRef.current.style.top = `${e.clientY}px`;
      })
    }

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [draggableRef, destroy, onDrop])

  return (
    <div
      ref={draggableRef}
      style={{
        width: '56px',
        height: '76px',
        ...(initialPosition ? { left: `${initialPosition.left + 56 / 2}px`, top: `${initialPosition.top + 76 / 2}px` } : {})
      }}
      onClick={(e) => console.log(e)}
      className="fixed bg-pink-600 -translate-x-1/2 -translate-y-1/2">

    </div>
  )
}

export function useDraggableSpawner() {
  const [draggables, setDraggables] = useState<React.ReactElement[]>([])

  const destroyDraggable = useCallback((handle: string) => {
    setDraggables((current) => {
      const newCurrent = [...current]
      return newCurrent.filter(({ key }) => key !== handle)
    })
  }, [])

  const spawnDraggable = useCallback((initialPosition: DOMRect, onDrop = () => { }) => {
    setDraggables((current) => {
      const id = makeId(4)
      const newCurrent = [...current]
      newCurrent.push(<Draggable key={`draggable-${id}`} onDrop={onDrop} destroy={() => destroyDraggable(`draggable-${id}`)} initialPosition={initialPosition} />)
      return newCurrent
    })
  }, [destroyDraggable])

  return {
    draggableSpawner: draggables,
    spawnDraggable
  }
}