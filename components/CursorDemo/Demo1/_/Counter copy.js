import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div>
            <h1>Counter: {count}</h1>
            <div className="flex justify-start gap-4">
                <button className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded" onClick={increment}>+</button>
                <button className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded" onClick={decrement}>-</button>
            </div>
        </div>
    );
};

export default Counter;