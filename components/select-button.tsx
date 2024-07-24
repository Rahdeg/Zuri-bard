import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type Option = {
    label: string;
    value: string;
};

type SelectableButtonFormProps = {
    values: Option[];
    selectedOptions: string[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

const SelectableButtonForm: React.FC<SelectableButtonFormProps> = ({ values, selectedOptions, setSelectedOptions }) => {
    const toggleValue = (value: string) => {
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(value)
                ? prevSelectedOptions.filter((v) => v !== value)
                : [...prevSelectedOptions, value]
        );
    };

    return (
        <div className='flex space-x-3'>
            {values.map((option) => (
                <Button
                    type="button"
                    key={option.value}
                    className={cn('bg-slate-400', selectedOptions.includes(option.value) && "bg-blue-600")}
                    onClick={() => toggleValue(option.value)}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
};

export default SelectableButtonForm;


// `category-button ${selectedOptions.includes(value) ? 'selected' : ''}