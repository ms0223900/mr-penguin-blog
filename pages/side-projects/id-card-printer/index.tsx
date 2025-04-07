/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

enum ImageType {
    Front = 'front',
    Back = 'back',
}

const GAP = 0;

const START_POSITION = {
    x: 50,
    y: 50,
}

const IDCardPrinterPage = () => {
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontFileInputRef = useRef<HTMLInputElement>(null);
    const backFileInputRef = useRef<HTMLInputElement>(null);
    const printFrameRef = useRef<HTMLIFrameElement>(null);

    // Canvas dimensions (A4 size)
    const CANVAS_WIDTH = 2480;
    const CANVAS_HEIGHT = 3508;

    // ID card dimensions on canvas
    const CARD_WIDTH = 1012 * 1.05;
    const CARD_HEIGHT = 638 * 1.05;

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
                    // Generate positions for 5 rows
                    const positions = [
                        ...makeRowCardPosition(0),
                        ...makeRowCardPosition(1),
                        ...makeRowCardPosition(2),
                        ...makeRowCardPosition(3),
                        ...makeRowCardPosition(4)
                    ];

                    // Draw all cards
                    positions.forEach(pos => {
                        if (pos.type === ImageType.Front) {
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

    const makeRowCardPosition = (rowIndex: number) => {
        return [
            {
                x: START_POSITION.x,
                y: START_POSITION.y + (CARD_HEIGHT + GAP) * rowIndex,
                type: ImageType.Front
            },
            {
                x: START_POSITION.x + CARD_WIDTH + GAP,
                y: START_POSITION.y + (CARD_HEIGHT + GAP) * rowIndex,
                type: ImageType.Back
            }
        ];
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: ImageType) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            if (type === ImageType.Front) {
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

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, type: ImageType) => {
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target?.result as string;
            if (type === ImageType.Front) {
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

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a new window with the canvas image
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('請允許彈出視窗以使用列印功能');
            return;
        }

        // Create HTML content for the print window
        printWindow.document.write(`
            <html>
                <head>
                    <title>身分證影印</title>
                    <style>
                        body { margin: 0; padding: 0; display: flex; justify-content: center; }
                        img { max-width: 100%; height: auto; }
                        @media print {
                            body { margin: 0; padding: 0; }
                            img { width: 100%; height: auto; }
                        }
                    </style>
                </head>
                <body>
                    <img src="${canvas.toDataURL('image/png')}" alt="身分證影印" />
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                window.close();
                            }, 200);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleReset = () => {
        setFrontImage(null);
        setBackImage(null);

        // Clear canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Reset file inputs
        if (frontFileInputRef.current) {
            frontFileInputRef.current.value = '';
        }
        if (backFileInputRef.current) {
            backFileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center p-4 min-h-screen">
            <Head>
                <title>身分證影印產生器 | Mr. Penguin</title>
            </Head>

            <h1 className="text-3xl font-bold mb-8 text-center">身分證影印產生器</h1>
            <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-4xl">
                <div>
                    <p className="text-center mb-8 max-w-lg">
                        上傳身分證正面和背面照片，一次產生多張證件影印排版。點擊下載按鈕儲存圖片以供列印。
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-4xl">
                        {/* Front ID Card Upload */}
                        <div
                            className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, ImageType.Front)}
                            onClick={() => frontFileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={frontFileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, ImageType.Front)}
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
                            onDrop={(e) => handleDrop(e, ImageType.Back)}
                            onClick={() => backFileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={backFileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, ImageType.Back)}
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
                </div>

                <div className="relative w-[50%] overflow-auto border border-gray-300 rounded-lg mb-8">
                    <div className="w-full bg-gray-100 p-2 text-sm text-gray-600 text-center">
                        A4 預覽 (2480 x 3508 像素)
                    </div>
                    <div className="p-2 bg-gray-50">
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            className="w-full h-auto border border-gray-200 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleDownload}
                    disabled={!frontImage || !backImage}
                    className={`py-3 px-6 rounded-lg text-white font-bold 
                    ${(!frontImage || !backImage)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    下載影印圖片
                </button>
                <button
                    onClick={handlePrint}
                    disabled={!frontImage || !backImage}
                    className={`py-3 px-6 rounded-lg text-white font-bold 
                    ${(!frontImage || !backImage)
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'}`}
                >
                    直接影印
                </button>
                <button
                    onClick={handleReset}
                    className="py-3 px-6 rounded-lg text-white font-bold bg-red-600 hover:bg-red-700"
                >
                    重設
                </button>
            </div>

            <div className="text-sm text-gray-600 mb-8 max-w-lg text-center">
                <p>上傳的照片僅在您的瀏覽器中處理，不會上傳至伺服器。</p>
                <p className="mt-2">建議使用高解析度的身分證照片以獲得最佳列印效果。</p>
            </div>

            {/* Hidden iframe for printing */}
            <iframe ref={printFrameRef} style={{ display: 'none' }} />
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {}
    };
};

export default IDCardPrinterPage; 