"use client"
import Currency from '@/components/ui/currency';
import IconButton from '@/components/ui/icon-button';
import { useGetProducts } from '@/features/products/api/use-get-products';
import useCart from '@/hooks/use-cart';
import usePreviewModal from '@/hooks/use-preview-modal';
import { transformImages } from '@/lib/utils';
import { Product } from '@/types';
import { Expand, ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { MouseEventHandler, useEffect, useState } from 'react';

interface ProductCardProps {
    product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const previewModal = usePreviewModal();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        previewModal.onOpen(transformImages(product))
    }

    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('product', JSON.stringify(product));
    }

    return (
        <div
            key={product.id}
            className="flex-shrink-0 w-80 p-4 group cursor-pointer"
            onClick={() => router.push(`/shop/${product.id}`)}
            draggable
            onDragStart={onDragStart}
        >
            <div className='w-full h-48 bg-[#f7f7f7f7] shadow-sm rounded-t-2xl relative'>
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className=' object-cover'
                />
                <div className=" opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                    <div className=" flex gap-x-6 justify-center">
                        <IconButton onClick={onPreview} icon={<Expand size={20} className=" text-gray-600" />} />
                        <IconButton onClick={onPreview} icon={<ShoppingCart size={20} className=" text-gray-600" />} />
                    </div>
                </div>
            </div>

            <div className="p-2 flex items-end justify-between w-full mt-3">
                <div className=' flex flex-col gap-y-3'>
                    <p className="text-sm text-[#666656] flex"> <Star className=' mr-2 size-4 fill-[#ED5221] text-[#ED5221]' />(11.6k Reviews)</p>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <div className=' flex items-center justify-start gap-x-3'>
                        <Currency value={product.price} />
                        <p className="text-sm text-gray-500">Sold Out {`No`}</p>
                    </div>
                </div>

                <button className=" size-10 bg-[#ED5221] text-white rounded-full flex items-center justify-center"
                    onClick={onPreview}
                >
                    <ShoppingBag className=' text-white size-5' />
                </button>
            </div>
        </div>
    )
}
