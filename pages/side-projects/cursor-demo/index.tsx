'use client'
import React, { useState, useEffect } from 'react';

const CursorDemo: React.FC = () => {
    const [activeDemo, setActiveDemo] = useState<string>('demo1');

    const renderDemo = () => {
        switch (activeDemo) {
            case 'demo1':
                return <div>Demo 1 Content</div>;
            case 'demo2':
                return <div>Demo 2 Content</div>;
            case 'demo3':
                return <div>Demo 3 Content</div>;
            default:
                return <div>Select a demo</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100">
            <h1 className="text-4xl font-bold my-8">Cursor Demo</h1>
            <>
                <div className="mb-8">
                    <button
                        className={`px-4 py-2 mr-2 rounded ${activeDemo === 'demo1' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveDemo('demo1')}
                    >
                        Demo 1
                    </button>
                    <button
                        className={`px-4 py-2 mr-2 rounded ${activeDemo === 'demo2' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveDemo('demo2')}
                    >
                        Demo 2
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeDemo === 'demo3' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveDemo('demo3')}
                    >
                        Demo 3
                    </button>
                </div>
                <div className="w-full max-w-md p-4 bg-white rounded shadow">
                    {renderDemo()}
                </div>
            </>
        </div>
    );
};

export default CursorDemo;
