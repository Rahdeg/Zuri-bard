"use client";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Currency from "./ui/currency";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useCart from "@/hooks/use-cart";
import usePreviewModal from "@/hooks/use-preview-modal";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const cart = useCart();
    const previewModal = usePreviewModal();

    const addToCart = () => {
        cart.addItem({ ...data, colors: selectedColor, sizes: selectedSize });
        previewModal.onClose();

    }

    const handleSizeClick = (size: string) => {
        if (selectedSize === size) {
            setSelectedSize(null);
        } else {
            setSelectedSize(size);
        }
    };

    const handleColorClick = (color: string) => {
        if (selectedColor === color) {
            setSelectedColor(null);
        } else {
            setSelectedColor(color);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">
                {data.name}
            </h1>
            <article className="py-2">
                A sleek, low-profile design combining style, comfort, and performance for basketball enthusiasts.
            </article>
            <hr className="my-4" />
            <div className="flex flex-col gap-y-6">
                <div className="flex flex-col items-start gap-y-4">
                    <h3 className="font-semibold text-black">Select Size</h3>
                    <div className="flex items-center justify-center gap-x-2">
                        {data.sizes.map((size) => (
                            <Button
                                type="button"
                                variant="outline"
                                key={size}
                                className={cn(
                                    "bg-white border border-[#ED5221] text-black",
                                    selectedSize === size && "bg-[#ED5221]"
                                )}
                                onClick={() => handleSizeClick(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex items-start flex-col gap-y-4">
                    <h3 className="font-semibold text-black">Select Color</h3>
                    <div className="flex items-center justify-center gap-x-2">
                        {data.colors.map((color) => (
                            <Button
                                type="button"
                                variant="outline"
                                key={color}
                                className={cn(
                                    "h-10 w-10 rounded-full border border-gray-600",
                                    selectedColor === color && "border-[#ED5221] border-2 shadow-md"
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => handleColorClick(color)}
                            ></Button>
                        ))}
                    </div>
                </div>
            </div>
            <hr className="my-4" />
            <div className="mt-3 flex items-end justify-between">
                <p className="text-2xl text-[#ED5221]">
                    <Currency value={data?.price} />
                </p>
            </div>
            <div className="mt-10 flex items-center gap-x-3">
                <Button variant="outline" className="flex  text-white items-center gap-x-2 bg-[#ED5221]" onClick={addToCart}>
                    Add to Cart
                    <ShoppingCart />
                </Button>
            </div>
        </div>
    );
};

export default Info;
