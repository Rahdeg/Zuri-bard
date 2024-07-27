"use client"
import { Button } from '@/components/ui/button'
import Autoplay from "embla-carousel-autoplay"
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { type CarouselApi } from "@/components/ui/carousel"
import Image from 'next/image'


const Hero = () => {

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)


    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api]);



    return (
        <div className=' py-16 px-3 lg:px-14 w-full'>
            <div className=' w-full flex flex-col lg:flex-row items-center justify-between '>
                <div className=' flex flex-col items-start justify-center w-full ' >
                    <p className=' text-4xl md:text-8xl font-bold jus'>BarbSh<span className='  lg:text-3xl  text-xl px-8 rounded-full lg:px-16 border-[10px] border-[#ED5221] '></span>w</p>
                    <p className='text-4xl md:text-8xl font-bold py-2 tracking-wider'>Collections!</p>

                    <div className=' flex items-start justify-between'>
                        <p className=' max-w-80 text-[#666565]'>
                            Discover our stylish and comfortable shoes, perfectly for every occasion and need.
                        </p>

                        <Button className=' rounded-3xl bg-[#ED5221] text-white'>
                            Shop Now
                        </Button>


                    </div>

                    <Button className=' bg-transparent rounded-3xl flex items-center justify-center border text-[#666565] border-gray-600 mt-6'>
                        7+ Brands
                    </Button>
                </div>

                <div className="relative flex items-center justify-center w-full mt-52 lg:mt-0">
                    <div className="absolute lg:inset-0   flex items-center justify-center ">
                        <div className="w-96 h-96 bg-[#Feeeea] rounded-full"></div>
                    </div>
                    <Carousel
                        className="flex items-center justify-center w-full px-3"
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        setApi={setApi}
                        plugins={[
                            Autoplay({
                                delay: 2000,
                            }),
                        ]}
                    >
                        <CarouselContent className="-ml-2 md:-ml-4 w-full">
                            <CarouselItem className="pl-2 md:pl-4">
                                {/* <Image src="/black.jpg" alt='bl' width={300} height={300} /> */}
                                A
                            </CarouselItem>
                            <CarouselItem className="pl-2 md:pl-4">
                                {/* <Image src="/brown.jpg" alt='bl' width={300} height={300} /> */}
                                B
                            </CarouselItem>
                            <CarouselItem className="pl-2 md:pl-4">

                                C
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </div>


            </div>


        </div>
    )
}

export default Hero