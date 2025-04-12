import { PlayerDeck } from "@/components/PlayerDeck";
import { Layout } from "@/layout";

const borders = [
  'left-[calc(50%+16px)] top-[calc(50%+16px)]',
  'left-[calc(50%-16px)] top-[calc(50%-16px)]',
  'left-[calc(50%+16px)] top-[calc(50%-16px)]',
  'left-[calc(50%-16px)] top-[calc(50%+16px)]',
]

export default function Test() {
  const content = '|'
  const size = '36rem'

  return (
    <Layout style={false ? undefined : { background: "url('/space.png')" }}>
      <div className="w-full h-full relative">
        <div className="w-full h-full translate-x-[calc(50%+24px)] translate-y-9 relative">
          {borders.map((offset) => (
            <span style={{ fontSize: size, lineHeight: size, width: size, height: size }} key={offset} className={`absolute ${offset} -translate-y-1/2 -translate-x-full`}>{content}</span>
          ))}
          <span style={{ fontSize: size, lineHeight: size, width: size, height: size }} className="text-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-full">{content}</span>
        </div>
      </div>
    </Layout>
  )
}