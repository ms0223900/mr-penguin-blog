import React, { useState } from 'react';

const categories = ['飲食', '日用品', '娛樂', '交通'];

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
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`py-1 px-2 rounded-full bg-gray-400 text-white text-sm ${
                            selectedCategory === category ? 'border-[3px] border-orange-500' : ''
                        }`}
                    >
                        {category}
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
