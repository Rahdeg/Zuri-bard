import React from 'react'
import { ProductCategory } from './product-categories'
import { ProductList } from './product-list'

export const ProductContainer = () => {




    return (
        <div className=' flex items-start justify-start gap-x-4 w-full'>
            <ProductCategory />
            <ProductList />

        </div>
    )
}
