"use client"
// import { useGetSummary } from '@/features/summary/api/use-get-summary'
import React from 'react'
import { Chart, ChartLoading } from './chart'
import { DataCard } from './ui/data-card'
import { FaArrowTrendDown } from 'react-icons/fa6'
import { useSearchParams } from 'next/navigation'
import { formatDateRange } from '@/lib/utils'
import { TopProductDataCard, TopProductDataCardLoading } from './ui/data-topproduct-card '
import { ProductDataCard } from './ui/data-product-card '
import { useGetSummary } from '@/features/summary/api/use-get-summary'
import { useGetProductWithIds } from '@/features/products/api/use-get-products-withId'
import { useGetProducts } from '@/features/products/api/use-get-products'
// import { Chart, ChartLoading } from './chart';
// import { SpendingPie, SpendingPieLoading } from './spending-pie';


interface Topseller {
    productId: string, totalQuantity: string
}

export const DataCharts = () => {

    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dateRangeLabel = formatDateRange({ to, from });


    const { data, isLoading } = useGetSummary();
    const { data: products } = useGetProducts(null);

    const topSellingMap = new Map(data?.topSelling.map((item: { productId: any; totalQuantity: any }) => [item.productId, item.totalQuantity]));

    const topSellingData = products?.filter((product) => topSellingMap.has(product.id)) // Filter based on IDs
        .map((product) => ({
            categoryName: product.categoryName, // Extract categoryName
            sellingPrice: product.sellingPrice, // Extract sellingPrice
            totalQuantity: topSellingMap.get(product.id) // Extract totalQuantity
        }));





    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                    <ChartLoading />
                </div>
                <TopProductDataCardLoading />

            </div>
        )
    }

    return (
        <div className=' grid grid-cols-1 lg:grid-cols-6 gap-8'>
            <div className=' col-span-1 lg:col-span-3 xl:col-span-4'>
                <Chart data={data?.pieData} />
            </div>
            <div className=' col-span-1 lg:col-span-3 xl:col-span-2'>
                {/* <SpendingPie data={data?.categories} /> */}
                <div className=' flex flex-col gap-y-3'>
                    <TopProductDataCard
                        title="Top Selling"
                        value={data?.topSelling.length}
                        percentageChange={5}
                        dateRange={dateRangeLabel}
                        data={topSellingData || []}
                    />


                </div>

            </div>

        </div>
    )
}
