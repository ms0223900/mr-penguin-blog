import React, { useEffect, useState } from "react";

interface DisplayProps {
    total: number;
}

const Display: React.FC<DisplayProps> = ({ total }) => {
    return (
        <div className="p-4">
            <div className="text-3xl font-bold text-right">${total}</div>
        </div>
    );
};

interface KeypadProps {
    onInput: (value: string) => void;
    onClear: () => void;
    onBackspace: () => void;
    onOk: () => void;
}

const Keypad: React.FC<KeypadProps & { currentAmount: string }> = ({
    onInput,
    onClear,
    onBackspace,
    onOk,
    currentAmount
}) => {
    const buttons = [
        "7", "8", "9", "AC",
        "4", "5", "6", "⌫",
        "1", "2", "3", 
        ".", "0", "+"
    ];

    return (
        <div>
            <div className="bg-black p-4">
                <div className="text-5xl font-bold text-white text-right">${currentAmount}</div>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-b-lg">
                {buttons.map((btn, index) => (
                    <button
                        key={index}
                        className={`p-4 text-xl font-bold rounded ${
                            btn === "AC"
                                ? "bg-orange-500 text-white"
                                : btn === "⌫"
                                    ? "bg-yellow-500 text-white"
                                    : btn === "+"
                                        ? "bg-gray-600 text-white"
                                        : "bg-gray-700 text-white"
                        }`}
                        onClick={() => {
                            if (btn === "AC") onClear();
                            else if (btn === "⌫") onBackspace();
                            else onInput(btn);
                        }}
                    >
                        {btn}
                    </button>
                ))}
                <button
                    className="p-4 text-xl font-bold rounded bg-blue-500 text-white row-span-2 col-start-4 row-start-3"
                    onClick={onOk}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

interface HistoryListProps {
    history: Array<{ amount: number; category: string; id: number }>;
    onEdit: (id: number, amount: number, category: string) => void;
    onDelete: (id: number) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onEdit, onDelete }) => {
    return (
        <div className="rounded-lg my-2 overflow-hidden">
            <ul className="flex flex-col gap-[10px]">
                {history.map((item) => (
                    <li key={item.id} className="bg-[#ffffff10] rounded-lg text-white py-3 px-4 flex items-center justify-between">
                        <div onDoubleClick={() => onEdit(item.id, item.amount, item.category)}>
                            <span className="text-xl">{item.category}</span>
                            <span className="text-3xl font-light ml-4">${item.amount}</span>
                        </div>
                        <button 
                            onClick={() => onDelete(item.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            刪除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface CategorySelectorProps {
    onSelectCategory: (category: string) => void;
    onCancel: () => void;
    pendingAmount: number;
}

const CategorySelector: React.FC<CategorySelectorProps & { initialCategory: string | null }> = ({ 
    onSelectCategory, 
    onCancel, 
    pendingAmount, 
    initialCategory 
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const categories = ["飲食", "日用品", "娛樂", "交通", "服飾", "醫療", "教育", "其他"];

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    const handleConfirm = () => {
        if (selectedCategory) {
            onSelectCategory(selectedCategory);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-white text-2xl mb-4 text-center">
                ${pendingAmount}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`p-2 rounded text-white ${
                            selectedCategory === category
                                ? "bg-gray-600 border-2 border-orange-500"
                                : "bg-gray-700"
                        }`}
                        onClick={() => handleCategorySelect(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="flex justify-between">
                <button
                    className="w-1/2 bg-red-500 text-white p-2 rounded mr-2"
                    onClick={onCancel}
                >
                    取消
                </button>
                <button
                    className="w-1/2 bg-blue-500 text-white p-2 rounded ml-2"
                    onClick={handleConfirm}
                    disabled={!selectedCategory}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [currentAmount, setCurrentAmount] = useState<string>("0");
    const [total, setTotal] = useState<number>(0);
    const [history, setHistory] = useState<Array<{ amount: number; category: string; id: number }>>([]);
    const [showCategorySelector, setShowCategorySelector] = useState<boolean>(false);
    const [pendingAmount, setPendingAmount] = useState<number | null>(null);
    const [editingItem, setEditingItem] = useState<{ id: number; amount: number; category: string } | null>(null);
    const [isEditingAmount, setIsEditingAmount] = useState<boolean>(false);

    const handleInput = (value: string) => {
        if (currentAmount === "0") {
            setCurrentAmount(value);
        } else {
            setCurrentAmount(currentAmount + value);
        }
    };

    const handleClear = () => {
        setCurrentAmount("0");
    };

    const handleBackspace = () => {
        if (currentAmount.length > 1) {
            setCurrentAmount(currentAmount.slice(0, -1));
        } else {
            setCurrentAmount("0");
        }
    };

    const handleOk = () => {
        const amount = parseFloat(currentAmount);
        if (!isNaN(amount)) {
            if (isEditingAmount) {
                setPendingAmount(amount);
                setIsEditingAmount(false);
                setShowCategorySelector(true);
            } else {
                setPendingAmount(amount);
                setShowCategorySelector(true);
            }
        }
        setCurrentAmount("0");
    };

    const handleSelectCategory = (category: string) => {
        if (pendingAmount !== null) {
            if (editingItem) {
                // Edit existing item
                setHistory(history.map(item => 
                    item.id === editingItem.id ? { ...item, amount: pendingAmount, category } : item
                ));
                setEditingItem(null);
            } else {
                // Add new item
                const newItem = { amount: pendingAmount, category, id: Date.now() };
                setHistory([...history, newItem]);
            }
            setPendingAmount(null);
        }
        setShowCategorySelector(false);
    };

    const handleEdit = (id: number, amount: number, category: string) => {
        setEditingItem({ id, amount, category });
        setPendingAmount(amount);
        setCurrentAmount(amount.toString());
        setIsEditingAmount(true);
    };

    const handleDelete = (id: number) => {
        const itemToDelete = history.find(item => item.id === id);
        if (itemToDelete) {
            setHistory(history.filter(item => item.id !== id));
        }
    };

    const handleCancelCategorySelection = () => {
        setPendingAmount(null);
        setShowCategorySelector(false);
    };

    useEffect(() => {
        const newTotal = history.reduce((sum, item) => sum + item.amount, 0);
        setTotal(newTotal);
    }, [history]);

    return (
        <div className="max-w-md mx-auto mt-10 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
            <Display total={total} />
            <div className="p-2 bg-blue-500">
                <HistoryList history={history} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
            {showCategorySelector ? (
                <CategorySelector
                    onSelectCategory={handleSelectCategory}
                    onCancel={handleCancelCategorySelection}
                    pendingAmount={pendingAmount || 0}
                    initialCategory={editingItem ? editingItem.category : null} // Pass initial category
                />
            ) : (
                <Keypad
                    onInput={handleInput}
                    onClear={handleClear}
                    onBackspace={handleBackspace}
                    onOk={handleOk}
                    currentAmount={currentAmount}
                />
            )}
        </div>
    );
};

export default App;
