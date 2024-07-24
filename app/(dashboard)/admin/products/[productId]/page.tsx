'use client'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetColors } from "@/features/colors/api/use-get-colors";
import { useCreateColor } from "@/features/colors/api/use-create-color";
import { useCreateSize } from "@/features/sizes/api/use-create-size";
import { useGetSizes } from "@/features/sizes/api/use-get-sizes";
import { useCreateProduct } from "@/features/products/api/use-create-product";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetProduct } from "@/features/products/api/use-get-product";
import { useEditProduct } from "@/features/products/api/use-edit-product";
import { useDeleteProduct } from "@/features/products/api/use-delete-product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Trash } from "lucide-react";
import { z } from "zod";
import ProductForm from "@/features/products/components/product-form";
import { useRouter } from "next/navigation";


const formSchema = z.object({
    colors: z.string().array(),
    isFeatured: z.boolean(),
    isArchived: z.boolean(),
    name: z.string(),
    price: z.string(), // Ensure price is a number
    images: z.object({ url: z.string() }).array().nonempty(),
    sizes: z.string().array(),
    categoryId: z.string(),
});

interface ProductInitialData {
    name?: string;
    categoryId?: string;
    price?: string;
    isFeatured?: boolean;
    isArchived?: boolean;
    colors?: string[];
    sizes?: string[];
    images?: { url: string }[];
}

type FormValues = z.infer<typeof formSchema>;

const NewProductPage = ({ params }: { params: { productId: string } }) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this product"
    );

    const router = useRouter();

    const productQuery = useGetProduct(params.productId);
    const editMutation = useEditProduct(params.productId);
    const deleteMutation = useDeleteProduct(params.productId);

    const isPending = editMutation.isPending || deleteMutation.isPending;
    const isLoading = productQuery.isLoading;

    const mutation = useCreateProduct();
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const colorQuery = useGetColors();

    const products = productQuery.data;

    const sizeQuery = useGetSizes();
    const sizeMutation = useCreateSize();

    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            categoryId: "",
            price: "",
            isFeatured: false,
            isArchived: false,
            colors: [],
            sizes: [],
            images: [],
        },
    });

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id,
    }));

    const colorOptions = (colorQuery.data ?? []).map((color) => ({
        label: color.name,
        value: color.id,
    }));

    const sizeOptions = (sizeQuery.data ?? []).map((size) => ({
        label: size.name,
        value: size.id,
    }));

    const onSubmit = (values: FormValues) => {
        const transformedValues = {
            ...values,
            price: parseFloat(values.price), // Ensure price is a number
        };

        mutation.mutate(transformedValues, {
            onSuccess: () => {
                form.reset();
                router.push('/admin/products')
            },
        });
    };

    const title = products ? "Edit product" : "Create product";
    const description = products ? "Edit a product" : "Add a new product";
    const toastMessage = products ? "Product updated" : "Product created";

    return (
        <>
            <ConfirmDialog />
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                        <CardTitle className='flex flex-col items-start justify-center'>
                            <h1 className='text-2xl font-bold'>
                                {title}
                            </h1>
                            <p className='text-base'>{description}</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {isLoading ? (
                            <div className='flex justify-center items-center h-full'>
                                <Loader className="size-6 text-slate-300 animate-spin" />
                            </div>
                        ) : (
                            <ProductForm
                                initialData={products}
                                onSubmit={onSubmit}
                                disabled={mutation.isPending}
                                categoryOptions={categoryOptions}
                                onCreateCategory={onCreateCategory}
                                colorOptions={colorOptions}
                                sizeOptions={sizeOptions}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default NewProductPage;
