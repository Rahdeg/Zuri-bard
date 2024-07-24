import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { insertProductSchema } from "@/db/schema";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNewProduct } from "../hooks/use-new-product";
import { useCreateProduct } from "../api/use-create-product";
import ProductForm from "./product-form";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetColors } from "@/features/colors/api/use-get-colors";
import { useCreateColor } from "@/features/colors/api/use-create-color";
import { useCreateSize } from "@/features/sizes/api/use-create-size";
import { useGetSizes } from "@/features/sizes/api/use-get-sizes";

export const NewProductSheet = () => {
    const { isOpen, onClose } = useNewProduct();

    const mutation = useCreateProduct();
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const colorQuery = useGetColors();
    const colorMutation = useCreateColor();

    const onCreateColor = (name: string, value?: string) => colorMutation.mutate({
        name, value: value ?? ""
    })


    const sizeQuery = useGetSizes();
    const sizeMutation = useCreateSize();

    const onCreateSize = (name: string, value?: string) => sizeMutation.mutate({
        name, value: value ?? ""
    })



    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name,
    })

    const formSchema = insertProductSchema.pick({
        name: true,
        categoryId: true,
        price: true,
        isFeatured: true,
        isArchived: true
    });

    type FormValues = z.input<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            categoryId: undefined,
            price: undefined,
            isFeatured: undefined,
            isArchived: undefined,
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

    const sizeOptions = (sizeQuery.data ?? []).map((color) => ({
        label: color.name,
        value: color.id,
    }));


    // const onSubmit = (values: FormValues) => {
    //     mutation.mutate(values, {
    //         onSuccess: () => {
    //             form.reset();
    //             onClose();
    //         },
    //     });
    // };



    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Product
                    </SheetTitle>
                    <SheetDescription>
                        Create a new product .
                    </SheetDescription>
                </SheetHeader>
                {/* <ProductForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "", categoryId: "", price: '', isFeatured: false, isArchived: false, sizeIds: [], colorIds: , imageUrls: [], }} categoryOptions={categoryOptions} onCreateCategory={onCreateCategory}
                    colorOptions={colorOptions} onCreateColor={onCreateColor}
                    sizeOptions={sizeOptions} onCreateSize={onCreateSize}
                /> */}
            </SheetContent>
        </Sheet>
    );
};