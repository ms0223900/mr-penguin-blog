'use client'
import React, { useState, useEffect } from 'react';
import CursorDemo1 from 'components/CursorDemo/Demo1';
enum DemoPage {
    Demo1 = 'demo1',
    // Demo2 = 'demo2',
    // Demo3 = 'demo3',
}

const demoButtons = [
    DemoPage.Demo1,
    // DemoPage.Demo2,
    // DemoPage.Demo3,
];

const demoComponents = {
    [DemoPage.Demo1]: <CursorDemo1 />,
    // [DemoPage.Demo2]: <div>Demo 2 Content</div>,
    // [DemoPage.Demo3]: <div>Demo 3 Content</div>,
};

const CursorDemo: React.FC = () => {
    const [activeDemo, setActiveDemo] = useState<DemoPage>(DemoPage.Demo1);
    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
            <h1 className="text-4xl font-bold my-8">Cursor Demo</h1>
            <>
                <div className="mb-8">
                    {demoButtons.map((demo, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 mr-2 rounded hover:bg-blue-600 hover:text-white ${activeDemo === demo ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setActiveDemo(demo)}
                        >
                            {demo}
                        </button>
                    ))}
                </div>
                <div className="w-full max-w-md p-4 bg-white rounded shadow">
                    {demoComponents[activeDemo]}
                </div>
            </>
        </div>
    );
};

export default CursorDemo;
