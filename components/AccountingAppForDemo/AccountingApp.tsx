import React, { useState } from "react";

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
    history: number[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
    return (
        <div className="rounded-lg my-2 overflow-hidden">
            <ul className="flex flex-col gap-[10px]">
                {history.map((amount, index) => (
                    <li key={index} className="bg-[#ffffff10] rounded-lg text-white py-3 px-4 flex items-center justify-end">
                        <span className="pr-1.5 text-xl">$</span>
                        <span className="text-3xl font-light">{amount}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const App: React.FC = () => {
    const [currentAmount, setCurrentAmount] = useState<string>("0");
    const [total, setTotal] = useState<number>(0);
    const [history, setHistory] = useState<number[]>([]);

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
        setTotal(total + amount);
        setHistory([...history, amount]);
        setCurrentAmount("0");
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-gray-100 rounded-lg shadow-lg overflow-hidden">
            <Display total={total} />
            <div className="p-2 bg-[#5E86A2]">
            <HistoryList history={history} />
            </div>
            <Keypad
                onInput={handleInput}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onOk={handleOk}
                currentAmount={currentAmount}
            />
        </div>
    );
};

export default App;
