"use client"
import { Product } from "@/types"
import { X } from "lucide-react"
import Image from "next/image"


import Currency from "@/components/ui/currency"
import useCart from "@/hooks/use-cart"
import { useEffect, useState } from "react"
import IconButton from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CartItemProps {
    data: Product
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const cart = useCart();


    if (!isMounted) {
        return null;
    }

    const onRemove = () => {
        cart.removeItem(data.id)
    }

    return (
        <div className=" flex py-6 border-b">
            <div className=" relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
                <Image fill src={data.images[0]?.url} className=" object-cover object-center" alt="" />
            </div>
            <div className=" relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className=" absolute z-10 right-0 top-0">
                    <IconButton icon={<X size={15} onClick={onRemove} />} />
                </div>
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className=" flex justify-between">
                        <p className=" text-lg font-semibold text-black">
                            {data.name}
                        </p>
                    </div>
                    <div className="mt-1 flex flex-col items-start justify-center gap-y-5">
                        <div className="flex items-center justify-center gap-x-2">
                            {data.colors.map((color) => (
                                <Button
                                    type="button"
                                    variant="outline"
                                    key={color}
                                    className=
                                    "h-10 w-10 rounded-full border border-gray-600"

                                    style={{ backgroundColor: color }}

                                ></Button>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-x-2">
                            {data.sizes.map((size) => (
                                <Button
                                    type="button"
                                    variant="outline"
                                    key={size}
                                    className=
                                    "bg-white border border-[#ED5221] text-black"



                                >
                                    {size}
                                </Button>
                            ))}
                        </div>

                    </div>
                    <Currency value={data.price} />
                </div>
            </div>
        </div>
    )
}

export default CartItem