import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, FileSearch, Loader2, PieChart } from "lucide-react";
import { AreaVariant } from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { PieVariant } from "./pie-variant";
// import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

type Props = {
    data?: {
        date: string;
        income: number;
        expenses: number;
    }[];
}



export const Chart = ({ data = [] }: Props) => {
    const [chartType, setChartType] = useState("bar");
    // const { shouldBlock, triggerPaywall } = usePaywall();

    const pieData = [
        {
            name: "solo",
            value: 300
        },
        {
            name: "solomon",
            value: 200
        }
    ];

    const onTypeChange = (type: string) => {

        setChartType(type);
    }

    return (
        <Card className=" border-none drop-shadow-sm">
            <CardHeader className=" flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <CardTitle className=" text-xl line-clamp-1 text-blue-900">
                    Transactions
                </CardTitle>
                <Select defaultValue={chartType} onValueChange={onTypeChange}>
                    <SelectTrigger className=" lg:w-auto h-9 rounded-md px-3">
                        <SelectValue placeholder="Chart type " className="text-blue-900" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pie">
                            <div className=" flex items-center text-blue-900">
                                <PieChart className=" size-4 mr-2 shrink-0" />
                                <p className=" line-clamp-1">Pie chart</p>
                            </div>
                        </SelectItem>
                        <SelectItem value="bar">
                            <div className=" flex items-center text-blue-900">
                                <AreaChart className=" size-4 mr-2 shrink-0" />
                                <p className=" line-clamp-1">Bar chart</p>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <CardContent>
                    {data.length === 0 ? (
                        <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                            <FileSearch className="size-6 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">
                                No data for this period
                            </p>
                        </div>
                    ) : (
                        <>
                            {chartType === "pie" && <PieVariant data={pieData} />}
                            {chartType === "bar" && <BarVariant data={data} />}

                        </>
                    )}
                </CardContent>
            </CardContent>

        </Card>
    )
}

export const ChartLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 lg:w-[120px] w-full" />
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
                </div>
            </CardContent>
        </Card>
    );
};
