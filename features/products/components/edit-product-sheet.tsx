import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { insertProductSchema } from "@/db/schema";
import { z } from "zod";
import { useGetProduct } from "../api/use-get-product";
import { useOpenProduct } from "../hooks/use-open-product";
import { Loader2 } from "lucide-react";
import { useEditProduct } from "../api/use-edit-product";
import { useDeleteProduct } from "../api/use-delete-product";
import { useConfirm } from "@/hooks/use-confirm";
import ProductForm from "./product-form";

export const EditProductSheet = () => {
    const { isOpen, onClose, id } = useOpenProduct();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this product"
    )

    const productQuery = useGetProduct(id);
    const editMutation = useEditProduct(id);
    const deleteMutation = useDeleteProduct(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = productQuery.isLoading;

    const formSchema = insertProductSchema.pick({
        name: true,
        categoryId: true,
        price: true,
        isFeatured: true,
        isArchived: true
    });

    type FormValues = z.input<typeof formSchema>;




    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }

    }

    const defaultValues = productQuery.data ? {
        name: productQuery.data.name,
        categoryId: productQuery.data.categoryId,
        price: productQuery.data.price,
        isFeatured: productQuery.data.isFeatured,
        isArchived: productQuery.data.isArchived,

    } : {
        name: "",
        categoryId: "",
        price: 0,
        isFeatured: false,
        isArchived: false,
    }



    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Product
                        </SheetTitle>
                        <SheetDescription>
                            Edit your  product .
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className=" absolute inset-0 flex items-center justify-center">
                                <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (<ProductForm onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} id={id} onDelete={onDelete} />)
                    }

                </SheetContent>
            </Sheet>
        </>

    );
};