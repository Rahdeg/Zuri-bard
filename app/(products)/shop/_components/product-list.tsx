'use client'

import React from 'react'
import TrendingProducts from '../../(homepage)/_components/trending-products'
import { ShoppingBag, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useGetProducts } from '@/features/products/api/use-get-products'


// const products = [
//     {
//         id: 1,
//         name: 'Nike Running Shoe',
//         price: '$349',
//         reviews: '11.6k Reviews',
//         soldOut: '85%',
//         image: '/black.jpg', // Update with correct image path
//     },
//     {
//         id: 2,
//         name: 'Nike Shoe Airmax',
//         price: '$349',
//         reviews: '11.6k Reviews',
//         soldOut: '85%',
//         image: '/black.jpg', // Update with correct image path
//     },
//     {
//         id: 3,
//         name: 'Jordan Sneaker',
//         price: '$349',
//         reviews: '11.6k Reviews',
//         soldOut: '85%',
//         image: '/brown.jpg', // Update with correct image path
//     },
//     {
//         id: 4,
//         name: 'Fit Elent Mosen',
//         price: '$349',
//         reviews: '11.6k Reviews',
//         soldOut: '85%',
//         image: '/brown.jpg', // Update with correct image path
//     },
//     {
//         id: 5,
//         name: 'Fit Elent Mosen',
//         price: '$349',
//         reviews: '11.6k Reviews',
//         soldOut: '85%',
//         image: '/brown.jpg', // Update with correct image path
//     },
//     {
//         id: 6,
//         name: 'Fit Elent Mosen',
//         price: '$349',
//         reviews: '11.6k Reviews',
//         soldOut: '85%',
//         image: '/brown.jpg', // Update with correct image path
//     },
// ];

export const ProductList = () => {

    const productsQuery = useGetProducts();
    const products = productsQuery.data;

    const router = useRouter();
    return (
        <div className=' flex items-center justify-center '>

            <div className=" grid grid-cols-3 gap-4 pl-20 ">
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
                                        <p className="text-sm text-gray-500">Sold Out {`60%`}</p>
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
    )
}
