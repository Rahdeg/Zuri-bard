import React from 'react'
import { ProductCategory } from './product-categories'
import { ProductList } from './product-list'

export const ProductContainer = () => {




    return (
        <div className=' flex flex-col md:flex-row items-center md:items-start justify-start gap-x-4 w-full'>
            <ProductCategory />
            <ProductList />

        </div>
    )
}
