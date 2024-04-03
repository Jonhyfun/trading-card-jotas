import Typewriter from 'react-ts-typewriter';
import { TripleBorder } from "@/components/TripleBorder";
import Link from 'next/link';
import { Layout } from '@/layout';

export default function Home() {
  return (
    <Layout>
      <div className="pt-8 grid grid-rows-3 w-full h-full">
        <Typewriter cursor={false} text="Trading Card Game do Jotas em breve!"/>
        <TripleBorder className="row-span-2" borderColor="gray-light">
          <div className="w-full h-full md:p-5 md:pt-7 p-3 pt-5 flex flex-col gap-6 md:text-base text-xs">
            <Link href="/game/123" className="group cursor-pointer"><span className="group-hover:visible invisible mr-2">*</span><span>Nova Partida</span></Link>
            <div className="group cursor-pointer"><span className="group-hover:visible invisible mr-2">*</span><span>Meus Decks</span></div>
          </div>
        </TripleBorder>
      </div>
    </Layout>
  );
}
