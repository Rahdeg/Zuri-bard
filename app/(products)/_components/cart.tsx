"use client"
import { Button } from '@/components/ui/button'
import useCart from '@/hooks/use-cart'
import usePreviewModal from '@/hooks/use-preview-modal'
import { transformImages } from '@/lib/utils'
import { ShoppingBag, ShoppingBasket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const Carts = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const cart = useCart();
    const router = useRouter();
    const previewModal = usePreviewModal();

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const product = JSON.parse(e.dataTransfer.getData('product'));
        previewModal.onOpen(transformImages(product))
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return (
        <div onDrop={onDrop} onDragOver={onDragOver}>
            <Button variant="outline" className=" flex items-center rounded-full bg-[#ed5221] px-4 py-2" onClick={() => router.push("/cart")}>
                <ShoppingBag size={20} color="white" />
                <span className="ml-2 text-sm font-medium text-white">
                    {cart.items.length}
                </span>
            </Button>
        </div>
    )
}
