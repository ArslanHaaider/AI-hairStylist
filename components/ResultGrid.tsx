
import React from 'react';
import { GeneratedImage } from '../types';

interface ResultGridProps {
    images: GeneratedImage[];
}

export const ResultGrid: React.FC<ResultGridProps> = ({ images }) => {
    return (
        <div className="w-full">
            <h3 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Your New Look!</h3>
            <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg overflow-hidden shadow-md group">
                        <div className="relative">
                            <img src={image.url} alt={image.label} className="w-full h-full object-cover aspect-square" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {image.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
