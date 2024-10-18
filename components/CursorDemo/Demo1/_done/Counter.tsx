import React, { useState } from 'react';

const Counter: React.FC = () => {
    const [count, setCount] = useState<number>(0);

    const increment = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const decrement = () => {
        setCount((prevCount) => prevCount - 1);
    };

    return (
        <div>
            <h1>Counter: {count}</h1>
            <div className="flex justify-start gap-4">
                <button className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded" onClick={increment}>+1</button>
                <button className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded" onClick={decrement}>-1</button>
            </div>
        </div>
    );
};

export default Counter;
