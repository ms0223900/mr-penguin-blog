import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

interface TileProps {
    gender: 'male' | 'female';
    isRevealed: boolean;
    onClick: () => void;
    rowIndex: number;
    colIndex: number;
}

const Tile: React.FC<TileProps> = ({ gender, isRevealed, onClick, rowIndex, colIndex }) => {
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
                <span className="text-gray-600 text-4xl">{(rowIndex * 3 + colIndex + 1)}</span>
            )}
        </div>
    );
};

interface GenderGrid {
    gender: 'male' | 'female';
    isRevealed: boolean;
}

const getAllLineGender = (grid: GenderGrid[][]): ('male' | 'female')[][] => {
    const lineGenders: ('male' | 'female')[][] = [];
    for (let row = 0; row < 3; row++) {
        if (grid[row][0].isRevealed && grid[row][1].isRevealed && grid[row][2].isRevealed) {
            lineGenders.push([grid[row][0].gender, grid[row][1].gender, grid[row][2].gender]);
        }
    }

    for (let col = 0; col < 3; col++) {
        if (grid[0][col].isRevealed && grid[1][col].isRevealed && grid[2][col].isRevealed) {
            lineGenders.push([grid[0][col].gender, grid[1][col].gender, grid[2][col].gender]);
        }
    }

    if (grid[0][0].isRevealed && grid[1][1].isRevealed && grid[2][2].isRevealed) {
        lineGenders.push([grid[0][0].gender, grid[1][1].gender, grid[2][2].gender]);
    }

    if (grid[0][2].isRevealed && grid[1][1].isRevealed && grid[2][0].isRevealed) {
        lineGenders.push([grid[0][2].gender, grid[1][1].gender, grid[2][0].gender]);
    }

    return lineGenders;
};

const checkSameGender = (genders: ('male' | 'female')[]): boolean => {
    const gender = genders[0];
    return genders.every(g => g === gender);
};

const GenderRevealPage = () => {
    // 預設的九宮格配置 (右邊一列都是男生，其他男女交錯但不會連成一線)
    const initialGrid: GenderGrid[][] = [
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

        const lineGenders = getAllLineGender(grid);
        const hasSameGender = lineGenders?.find(lineGender => checkSameGender(lineGender));
        if (hasSameGender) {
            const newGrid = grid.map(row =>
                row.map(tile => ({ ...tile, isRevealed: true }))
            );
            setGrid(newGrid);
            setAllRevealed(true);
            return;
        }

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
                            rowIndex={rowIndex}
                            colIndex={colIndex}
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