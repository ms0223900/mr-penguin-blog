import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

interface TileProps {
    gender: 'male' | 'female';
    isRevealed: boolean;
    onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ gender, isRevealed, onClick }) => {
    return (
        <div
            className={`
        w-24 h-24 md:w-32 md:h-32 rounded-lg cursor-pointer flex items-center justify-center 
        transition-all duration-500 transform ${isRevealed ? 'rotate-y-180' : ''}
        ${isRevealed && gender === 'male' ? 'bg-blue-500' : ''}
        ${isRevealed && gender === 'female' ? 'bg-pink-500' : ''}
        ${!isRevealed ? 'bg-gray-300 hover:bg-gray-400' : ''}
      `}
            onClick={onClick}
        >
            {isRevealed ? (
                <span className="text-white text-4xl font-bold">
                    {gender === 'male' ? '👦' : '👧'}
                </span>
            ) : (
                <span className="text-gray-600 text-4xl">❓</span>
            )}
        </div>
    );
};

const GenderRevealPage = () => {
    // 預設的九宮格配置 (右邊一列都是男生，其他男女交錯但不會連成一線)
    const initialGrid = [
        [{ gender: 'female' as const, isRevealed: false }, { gender: 'male' as const, isRevealed: false }, { gender: 'male' as const, isRevealed: false }],
        [{ gender: 'male' as const, isRevealed: false }, { gender: 'female' as const, isRevealed: false }, { gender: 'male' as const, isRevealed: false }],
        [{ gender: 'female' as const, isRevealed: false }, { gender: 'male' as const, isRevealed: false }, { gender: 'male' as const, isRevealed: false }]
    ];

    const [grid, setGrid] = useState(initialGrid);
    const [allRevealed, setAllRevealed] = useState(false);

    const handleTileClick = (rowIndex: number, colIndex: number) => {
        const newGrid = [...grid];
        newGrid[rowIndex][colIndex].isRevealed = true;
        setGrid(newGrid);

        // 檢查是否所有磁貼都已翻開
        const allAreRevealed = newGrid.flat().every(tile => tile.isRevealed);
        setAllRevealed(allAreRevealed);
    };

    const resetGame = () => {
        const newGrid = grid.map(row =>
            row.map(tile => ({ ...tile, isRevealed: false }))
        );
        setGrid(newGrid);
        setAllRevealed(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Head>
                <title>性別揭曉翻牌九宮格 | Mr. Penguin</title>
            </Head>

            <h1 className="text-3xl font-bold mb-8 text-center">性別揭曉翻牌九宮格</h1>
            <p className="text-center mb-8 max-w-lg">
                點擊卡片來揭曉性別！
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {grid.map((row, rowIndex) => (
                    row.map((tile, colIndex) => (
                        <Tile
                            key={`${rowIndex}-${colIndex}`}
                            gender={tile.gender}
                            isRevealed={tile.isRevealed}
                            onClick={() => handleTileClick(rowIndex, colIndex)}
                        />
                    ))
                ))}
            </div>

            {allRevealed && (
                <div className="bg-green-100 p-4 rounded-lg text-center mb-8">
                    <p className="text-green-800 font-bold">所有卡片都已揭曉！ 是個男孩紙！</p>
                </div>
            )}

            <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
                重新開始
            </button>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {}
    };
};

export default GenderRevealPage; 