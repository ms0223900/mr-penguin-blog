import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGeneratorPage = () => {
    const [url, setUrl] = useState<string>('https://');
    const [size, setSize] = useState<number>(200);
    const [margin, setMargin] = useState<number>(1);
    const [format, setFormat] = useState<'png' | 'jpg'>('png');
    const [bgTransparent, setBgTransparent] = useState<boolean>(true);
    const qrCodeRef = useRef<HTMLDivElement>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(e.target.value));
    };

    const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMargin(parseInt(e.target.value));
    };

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormat(e.target.value as 'png' | 'jpg');
        if (e.target.value === 'jpg') {
            setBgTransparent(false);
        }
    };

    const handleBgTransparentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBgTransparent(e.target.checked);
    };

    const downloadQRCode = () => {
        if (!qrCodeRef.current) return;

        const svgElement = qrCodeRef.current.querySelector('svg');
        if (!svgElement) return;

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas dimensions to match QR code size
        canvas.width = size;
        canvas.height = size;

        // If background is not transparent, fill with white
        if (!bgTransparent) {
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Convert SVG to image data
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();

        img.onload = () => {
            context.drawImage(img, 0, 0);

            // Convert canvas to image data
            const mime = format === 'png' ? 'image/png' : 'image/jpeg';
            const dataUrl = canvas.toDataURL(mime);

            // Create download link
            const link = document.createElement('a');
            link.download = generateFileName(format, url);
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // Load SVG into image
        img.src = 'data:image/svg+xml;base64,' + btoa(new TextEncoder().encode(svgData).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    };

    return (
        <div className="flex flex-col items-center p-4 min-h-screen">
            <Head>
                <title>QR Code 產生器 | Mr. Penguin</title>
            </Head>

            <h1 className="text-3xl font-bold mb-8 text-center">QR Code 產生器</h1>

            <div className="flex flex-col xl:flex-row gap-8 mb-8 w-full max-w-[960px]">
                <div className="flex-1">
                    <div className="mb-6">
                        <label htmlFor="url" className="block mb-2 font-medium">網址</label>
                        <input
                            type="text"
                            id="url"
                            value={url}
                            onChange={handleUrlChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="輸入網址..."
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="size" className="block mb-2 font-medium">解析度（像素）: {size} x {size}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                id="size"
                                min="200"
                                max="1000"
                                step="10"
                                value={size}
                                onChange={handleSizeChange}
                                className="w-full"
                            />
                            <input
                                type="number"
                                min="200"
                                max="1000"
                                step="10"
                                value={size}
                                onChange={handleSizeChange}
                                className="w-20 p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="margin" className="block mb-2 font-medium">邊界大小: {margin}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                id="margin"
                                min="0"
                                max="5"
                                step="1"
                                value={margin}
                                onChange={handleMarginChange}
                                className="w-full"
                            />
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="1"
                                value={margin}
                                onChange={handleMarginChange}
                                className="w-20 p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="format" className="block mb-2 font-medium">檔案格式</label>
                        <select
                            id="format"
                            value={format}
                            onChange={handleFormatChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="png">PNG</option>
                            <option value="jpg">JPG</option>
                        </select>
                    </div>

                    {format === 'png' && (
                        <div className="mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={bgTransparent}
                                    onChange={handleBgTransparentChange}
                                    className="form-checkbox h-5 w-5"
                                />
                                <span>透明背景</span>
                            </label>
                        </div>
                    )}

                    <button
                        onClick={downloadQRCode}
                        disabled={!url.trim()}
                        className={`mt-4 py-3 px-6 rounded-lg text-white font-bold 
              ${!url.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        下載 QR Code
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <div className="mb-4 text-lg font-medium">預覽</div>
                    <div
                        ref={qrCodeRef}
                        className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-[300px]"
                        style={{
                            backgroundColor: bgTransparent && format === 'png' ? 'transparent' : 'white'
                        }}
                    >
                        {url.trim() ? (
                            <QRCodeSVG
                                value={url}
                                size={size}
                                level="H"
                                marginSize={margin}
                                className='w-full h-full'
                                bgColor={bgTransparent && format === 'png' ? "transparent" : "#FFFFFF"}
                            />
                        ) : (
                            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
                                <p className="text-gray-400 text-center">請輸入網址</p>
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-sm text-gray-600">尺寸: {size} x {size} 像素</p>
                </div>
            </div>

            <div className="text-sm text-gray-600 mb-8 max-w-lg text-center">
                <p>所有操作都在您的瀏覽器中進行，不會上傳任何資料到伺服器。</p>
            </div>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {}
    };
};

export const generateFileName = (format: 'png' | 'jpg', url: string): string => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, '/');
    const formattedTime = today.toLocaleTimeString('zh-TW', { hour12: false }).slice(0, 5).replace(/:/g, '');
    const sanitizedUrl = url.replace(/\./g, '_').replace(/https?:\/\//, '');
    return `qrcode_${formattedDate}_${formattedTime}_${sanitizedUrl}.${format}`;
};
export default QRCodeGeneratorPage; 