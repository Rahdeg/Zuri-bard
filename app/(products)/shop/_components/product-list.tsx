'use client'

import React from 'react'
import TrendingProducts from '../../(homepage)/_components/trending-products'
import { ShoppingBag, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useGetProducts } from '@/features/products/api/use-get-products'
import { ProductCard } from './product-card'


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
        <div className=' flex items-center justify-center w-full lg:w-auto '>

            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-4 lg:pl-20 w-full lg:w-auto ">
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
    )
}
