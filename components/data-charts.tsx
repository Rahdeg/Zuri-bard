"use client"
// import { useGetSummary } from '@/features/summary/api/use-get-summary'
import React from 'react'
import { Chart } from './chart'
import { DataCard } from './ui/data-card'
import { FaArrowTrendDown } from 'react-icons/fa6'
import { useSearchParams } from 'next/navigation'
import { formatDateRange } from '@/lib/utils'
import { TopProductDataCard } from './ui/data-topproduct-card '
import { ProductDataCard } from './ui/data-product-card '
// import { Chart, ChartLoading } from './chart';
// import { SpendingPie, SpendingPieLoading } from './spending-pie';

export const DataCharts = () => {

    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dateRangeLabel = formatDateRange({ to, from });


    // const { data, isLoading } = useGetSummary();

    // if (isLoading) {
    //     return (
    //         <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
    //             <div className="col-span-1 lg:col-span-3 xl:col-span-4">
    //                 <ChartLoading />
    //             </div>
    //             <div className="col-span-1 lg:col-span-3 xl:col-span-2">
    //                 <SpendingPieLoading />
    //             </div>
    //         </div>
    //     )
    // }

    const data = [
        {
            date: '12/10/2023', income: 30, expenses: 20
        }, {
            date: '12/10/2023', income: 30, expenses: 20
        }
    ]
    return (
        <div className=' grid grid-cols-1 lg:grid-cols-6 gap-8'>
            <div className=' col-span-1 lg:col-span-3 xl:col-span-4'>
                <Chart data={data} />
            </div>
            <div className=' col-span-1 lg:col-span-3 xl:col-span-2'>
                {/* <SpendingPie data={data?.categories} /> */}
                <div className=' flex flex-col gap-y-3'>
                    <TopProductDataCard
                        title="Top Selling"
                        value={200}
                        percentageChange={5}
                        dateRange={dateRangeLabel}
                    />


                </div>

            </div>

        </div>
    )
}
