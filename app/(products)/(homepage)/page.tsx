import Image from "next/image";

import NewCollection from "./_components/collections";
import Hero from "./_components/hero";
import TrendingProducts from "./_components/trending-products";

export default function Home() {
  return (
    <div className=" flex flex-col items-center justify-center ">
      <Hero />
      <TrendingProducts />
      <NewCollection />
    </div>
  );
}
