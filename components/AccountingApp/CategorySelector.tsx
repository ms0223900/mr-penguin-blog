import React, { useState } from 'react';

export const categories = [
    { value: 'breakfast', label: '早餐' },
    { value: 'lunch', label: '午餐' },
    { value: 'dinner', label: '晚餐' },
    { value: 'dailyNecessities', label: '日用品' },
    { value: 'entertainment', label: '娛樂' },
    { value: 'transportation', label: '交通' },
    { value: 'filialPiety', label: '孝親123' },
    { value: 'clothing', label: '衣物' },
    { value: 'snacks', label: '零食' },
];

interface BudgetTrackerProps {
    onSaveCategory: (category: string) => void;
}

const CategorySelector: React.FC<BudgetTrackerProps> = ({ onSaveCategory }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const handleSave = () => {
        if (selectedCategory) {
            onSaveCategory(selectedCategory);
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-1 w-full">
            <div className="grid grid-cols-4 gap-1 w-full">
                {categories.map((category) => (
                    <button
                        key={category.value}
                        onClick={() => handleCategorySelect(category.value)}
                        className={`py-1 px-2 rounded-full bg-gray-400 text-white text-sm ${
                            selectedCategory === category.value ? 'border-[3px] border-orange-500' : ''
                        }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSave}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full w-full"
            >
                OK
            </button>
        </div>
    );
};

export default CategorySelector;