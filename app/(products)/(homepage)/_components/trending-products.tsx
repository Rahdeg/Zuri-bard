"use client"
import IconButton from '@/components/ui/icon-button';
import { useGetProducts } from '@/features/products/api/use-get-products';
import useCart from '@/hooks/use-cart';
import usePreviewModal from '@/hooks/use-preview-modal';
import { Expand, ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { ProductCard } from '../../shop/_components/product-card';

const TrendingProducts = () => {

    const productsQuery = useGetProducts();
    const products = productsQuery.data;


    return (
        <div className=" px-3 lg:px-14   w-full py-16 mt-16 md:mt-0 flex flex-col gap-y-10">
            <div className=' flex items-center justify-between w-full '>
                <h2 className="text-2xl font-bold mb-4 text-[#666565]">Trending Products</h2>
                <div className=" space-x-2 ">
                    <button className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full">&larr;</button>
                    <button className="w-8 h-8 bg-orange-500 text-white rounded-full">&rarr;</button>
                </div>
            </div>

            <div className=" flex items-center  overflow-x-scroll w-full" >
                {products ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className=' flex items-center justify-center '>
                        <p>No Trending Products</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TrendingProducts;
