import React from 'react';
import { GeneratedImage } from '../types';

interface ResultGridProps {
    images: GeneratedImage[];
}

export const ResultGrid: React.FC<ResultGridProps> = ({ images }) => {
    return (
        <div className="w-full animate-fade-in">
            <h3 className="text-2xl font-bold mb-4 text-center text-slate-100">Your New Look!</h3>
            <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative bg-slate-900 rounded-lg overflow-hidden shadow-lg group transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20">
                        <img src={image.url} alt={image.label} className="w-full h-full object-cover aspect-square" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                            <p className="p-4 text-white text-sm font-semibold text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {image.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};