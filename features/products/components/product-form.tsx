import React, { useState } from 'react';
import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { insertProductSchema } from '@/db/schema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import Select from '@/components/select';
import AmountInput from '@/components/amount-input';
import ImageUpload from '@/components/ui/image-upload';
import SelectableButtonForm from '@/components/select-button';


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


const apiSchema = insertProductSchema.omit({
    id: true,
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
    id?: string;
    initialData: ProductInitialData;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    categoryOptions: { label: string; value: string }[];
    onCreateCategory: (name: string) => void;
    colorOptions: { label: string; value: string }[];
    sizeOptions: { label: string; value: string }[];
};

const ProductForm: React.FC<Props> = ({
    id,
    initialData,
    onSubmit,
    onDelete,
    disabled,
    categoryOptions,
    onCreateCategory,
    colorOptions,

    sizeOptions,

}) => {


    console.log("inits", initialData);
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
        } : {
            name: '',
            images: [],
            price: '',
            categoryId: '',
            colors: [],
            sizes: [],
            isFeatured: false,
            isArchived: false
        }
    });

    const action = initialData ? "Save changes" : "Create"


    const { watch } = form;
    const name = watch('name');
    // const sizes = watch('sizes');
    const isButtonDisabled = disabled || !name

    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
    const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);

    // console.log(initialData.sizes);

    const handleSubmit = (values: FormValues) => {
        onSubmit({ ...values, colors: selectedColors, sizes: selectedSizes });
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4 w-full">
                <FormField
                    name="images"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value.map((image) => image.url ? image.url : image)}
                                    disable={disabled}
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className=' grid grid-cols-3 gap-y-1 w-full'>
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={disabled} placeholder="palm" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="categoryId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder="Select a category"
                                        options={categoryOptions}
                                        onChange={field.onChange}
                                        onCreate={onCreateCategory}
                                        value={field.value}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="colors"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Colors</FormLabel>
                                <FormControl>
                                    <SelectableButtonForm
                                        values={colorOptions}
                                        selectedOptions={selectedColors}
                                        setSelectedOptions={setSelectedColors}

                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="sizes"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <SelectableButtonForm
                                        values={sizeOptions}
                                        selectedOptions={selectedSizes}
                                        setSelectedOptions={setSelectedSizes}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <AmountInput
                                    {...field}
                                    disabled={disabled}
                                    placeholder="0.00"

                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Selection */}


                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none ml-2">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>This product will appear on the home page</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isArchived"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none ml-2">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>This product will not appear anywhere in the store.</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>


                <Button className="w-full" disabled={isButtonDisabled}>
                    {action}
                </Button>
                {initialData && (
                    <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full flex gap-x-2" variant="outline">
                        <Trash className="w-4 h-4" />
                        <p>Delete product</p>
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default ProductForm;
