/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

interface IDCardImage {
    src: string;
    type: 'front' | 'back';
}

const IDCardPrinterPage = () => {
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontFileInputRef = useRef<HTMLInputElement>(null);
    const backFileInputRef = useRef<HTMLInputElement>(null);

    // Canvas dimensions (A4 size)
    const CANVAS_WIDTH = 2480;
    const CANVAS_HEIGHT = 3508;

    // ID card dimensions on canvas
    const CARD_WIDTH = 1012;
    const CARD_HEIGHT = 638;

    useEffect(() => {
        drawCanvas();
    }, [frontImage, backImage]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas and set white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid lines (optional)
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;

        // Draw cards if images are available
        if (frontImage && backImage) {
            const frontImg = new Image();
            const backImg = new Image();

            frontImg.onload = () => {
                backImg.onload = () => {
                    // Position cards in a 5x2 grid (5 rows, 2 columns)
                    const positions = [
                        // Row 1
                        { x: 200, y: 200, type: 'front' },
                        { x: 1268, y: 200, type: 'back' },
                        // Row 2
                        { x: 200, y: 888, type: 'front' },
                        { x: 1268, y: 888, type: 'back' },
                        // Row 3
                        { x: 200, y: 1576, type: 'front' },
                        { x: 1268, y: 1576, type: 'back' },
                        // Row 4
                        { x: 200, y: 2264, type: 'front' },
                        { x: 1268, y: 2264, type: 'back' },
                        // Row 5
                        { x: 200, y: 2952, type: 'front' },
                        { x: 1268, y: 2952, type: 'back' },
                    ];

                    // Draw all cards
                    positions.forEach(pos => {
                        if (pos.type === 'front') {
                            ctx.drawImage(frontImg, pos.x, pos.y, CARD_WIDTH, CARD_HEIGHT);
                        } else {
                            ctx.drawImage(backImg, pos.x, pos.y, CARD_WIDTH, CARD_HEIGHT);
                        }

                        // Draw border around card
                        ctx.strokeRect(pos.x, pos.y, CARD_WIDTH, CARD_HEIGHT);
                    });
                };
                backImg.src = backImage;
            };
            frontImg.src = frontImage;
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            if (type === 'front') {
                setFrontImage(imgSrc);
            } else {
                setBackImage(imgSrc);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, type: 'front' | 'back') => {
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            if (type === 'front') {
                setFrontImage(imgSrc);
            } else {
                setBackImage(imgSrc);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create temporary link element
        const link = document.createElement('a');
        link.download = '身分證影印.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <Head>
                <title>身分證影印產生器 | Mr. Penguin</title>
            </Head>

            <h1 className="text-3xl font-bold mb-8 text-center">身分證影印產生器</h1>
            <p className="text-center mb-8 max-w-lg">
                上傳身分證正面和背面照片，一次產生多張證件影印排版。點擊下載按鈕儲存圖片以供列印。
            </p>

            <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-4xl">
                {/* Front ID Card Upload */}
                <div
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'front')}
                    onClick={() => frontFileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={frontFileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'front')}
                    />

                    {frontImage ? (
                        <div className="relative w-full">
                            <img
                                src={frontImage}
                                alt="身分證正面"
                                className="w-full h-auto object-contain max-h-40"
                            />
                            <p className="mt-2 text-center text-sm text-gray-600">已上傳正面</p>
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-600 text-center">
                                點擊或拖曳上傳<br />身分證<span className="font-bold">正面</span>
                            </p>
                        </>
                    )}
                </div>

                {/* Back ID Card Upload */}
                <div
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'back')}
                    onClick={() => backFileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={backFileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'back')}
                    />

                    {backImage ? (
                        <div className="relative w-full">
                            <img
                                src={backImage}
                                alt="身分證背面"
                                className="w-full h-auto object-contain max-h-40"
                            />
                            <p className="mt-2 text-center text-sm text-gray-600">已上傳背面</p>
                        </div>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-gray-600 text-center">
                                點擊或拖曳上傳<br />身分證<span className="font-bold">背面</span>
                            </p>
                        </>
                    )}
                </div>
            </div>

            <button
                onClick={handleDownload}
                disabled={!frontImage || !backImage}
                className={`mb-8 py-3 px-6 rounded-lg text-white font-bold 
          ${(!frontImage || !backImage)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                下載影印圖片
            </button>

            <div className="relative w-full max-w-full overflow-auto border border-gray-300 rounded-lg mb-8">
                <div className="w-full bg-gray-100 p-2 text-sm text-gray-600 text-center">
                    A4 預覽 (2480 x 3508 像素)
                </div>
                <div className="p-2 bg-gray-50">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        className="w-full h-auto border border-gray-200 shadow-sm"
                        style={{ maxWidth: '100%' }}
                    />
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-8 max-w-lg text-center">
                <p>上傳的照片僅在您的瀏覽器中處理，不會上傳至伺服器。</p>
                <p className="mt-2">建議使用高解析度的身分證照片以獲得最佳列印效果。</p>
            </div>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {}
    };
};

export default IDCardPrinterPage; 