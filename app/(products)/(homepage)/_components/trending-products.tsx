"use client"
import { useGetProducts } from '@/features/products/api/use-get-products';
import { ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const TrendingProducts = () => {

    const productsQuery = useGetProducts();
    const products = productsQuery.data;
    const router = useRouter();



    return (
        <div className=" px-3 lg:px-14   w-full py-16 mt-16 md:mt-0 flex flex-col gap-y-10">
            <div className=' flex items-center justify-between w-full '>
                <h2 className="text-2xl font-bold mb-4 text-[#666565]">Trending Products</h2>
                <div className=" space-x-2 ">
                    <button className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full">&larr;</button>
                    <button className="w-8 h-8 bg-orange-500 text-white rounded-full">&rarr;</button>
                </div>
            </div>

            <div className=" flex items-center  overflow-x-scroll w-full">
                {products ? (
                    products.map(product => (
                        <div key={product.id} className="flex-shrink-0 w-80  p-4 ">

                            <div className='w-full h-48 bg-[#f7f7f7f7]  shadow-sm rounded-t-2xl relative'>
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className=' object-cover'
                                />
                            </div>

                            <div className="p-2 flex items-end justify-between w-full  mt-3">
                                <div className=' flex flex-col gap-y-3'>
                                    <p className="text-sm text-[#666656] flex"> <Star className=' mr-2 size-4 fill-[#ED5221] text-[#ED5221]' />(11.6k Reviews)</p>
                                    <h3 className="text-lg font-medium">{product.name}</h3>
                                    <div className=' flex items-center justify-start gap-x-3'>
                                        <p className="text-lg font-semibold">{product.price}</p>
                                        <p className="text-sm text-gray-500">Sold Out {`No`}</p>
                                    </div>
                                </div>


                                <button className=" size-10 bg-[#ED5221] text-white rounded-full flex items-center justify-center"
                                    onClick={() => router.push(`/shop/${product.id}`)}
                                >

                                    <ShoppingBag className=' text-white size-5' />
                                </button>
                            </div>
                        </div>
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
