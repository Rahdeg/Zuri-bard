"use client"

import { useMountedState } from "react-use"

// import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
// import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { NewSizeSheet } from "@/features/sizes/components/new-size-sheet";
import { EditSizeSheet } from "@/features/sizes/components/edit-size-sheet";
import { NewColorSheet } from "@/features/colors/components/new-color-sheet";
import { EditColorSheet } from "@/features/colors/components/edit-color-sheet";
import { NewProductSheet } from "@/features/products/components/new-product-sheet";
import { EditProductSheet } from "@/features/products/components/edit-product-sheet";
import PreviewModal from "@/components/preview-modal";
// import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
// import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
// import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";


export const SheetProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* <NewAccountSheet />
            <EditAccountSheet /> */}
            <NewCategorySheet />
            <EditCategorySheet />
            <NewSizeSheet />
            <EditSizeSheet />
            <NewColorSheet />
            <EditColorSheet />
            <NewProductSheet />
            <EditProductSheet />
            <PreviewModal />
            {/* <NewTransactionSheet />
            <EditTransactionSheet />
            <SubscriptionModal /> */}
        </>
    )
}

