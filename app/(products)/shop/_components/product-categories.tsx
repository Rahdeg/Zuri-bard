"use client"
import { Button } from '@/components/ui/button'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export const ProductCategory = () => {


    // const categories = [
    //     { id: 1, name: "Men's Shoes" },
    //     { id: 2, name: "Women's Shoes" },
    //     { id: 3, name: "Kid's Shoes" },
    // ]

    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data;

    return (
        <div className=' flex flex-col'>
            <h1 className=' text-xl font-bold py-3 border-b-2 '>Product Categories</h1>
            <div className=' flex flex-col gap-y-2 py-2'>
                {
                    categories ? (
                        categories.map((category) => (
                            <div key={category.id} className=' flex items-center justify-between '>
                                <p className='text-[#666565]'>
                                    {category.name}
                                </p>
                                <Button variant="ghost" className=' rounded-2xl flex items-center justify-center '>
                                    <ArrowRight className=' size-3  text-[#666565]' />
                                </Button>

                            </div>
                        ))
                    ) : (
                        <div className=' flex items-center justify-center '>
                            <p>No Category </p>
                        </div>
                    )

                }
            </div>

        </div>
    )
}
