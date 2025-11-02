
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultGrid } from './components/ResultGrid';
import { Loader } from './components/Loader';
import { generateHairstyles } from './services/geminiService';
import { GeneratedImage } from './types';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [hairstylePrompt, setHairstylePrompt] = useState<string>('');
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (file: File) => {
        setOriginalImage(file);
        setGeneratedImages([]);
        setError(null);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // remove the data:mime/type;base64, part
                resolve(result.split(',')[1]);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleGenerateClick = useCallback(async () => {
        if (!originalImage || !hairstylePrompt.trim()) {
            setError('Please upload an image and describe a hairstyle.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const base64Image = await fileToBase64(originalImage);
            const results = await generateHairstyles(base64Image, originalImage.type, hairstylePrompt);
            setGeneratedImages(results);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during hairstyle generation.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, hairstylePrompt]);

    const isGenerateDisabled = !originalImage || !hairstylePrompt.trim() || isLoading;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <header className="py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        AI Hairstyle Try-On
                    </h1>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Control Panel */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                             <h2 className="text-xl font-semibold mb-1 text-gray-200">1. Upload Your Headshot</h2>
                             <p className="text-sm text-gray-400 mb-4">For best results, use a clear, front-facing photo.</p>
                            <ImageUploader onImageUpload={handleImageUpload} />
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-1 text-gray-200">2. Describe Your Dream Hairstyle</h2>
                            <p className="text-sm text-gray-400 mb-4">Be creative! Try "long curly blonde hair" or "a sharp silver buzz cut".</p>
                            <textarea
                                value={hairstylePrompt}
                                onChange={(e) => setHairstylePrompt(e.target.value)}
                                placeholder="e.g., a vibrant pink mohawk with shaved sides"
                                className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
                            />
                        </div>
                        
                         {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">{error}</div>}
                    </div>

                    {/* Results Panel */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[400px] flex flex-col justify-center items-center">
                        {isLoading ? (
                            <Loader />
                        ) : generatedImages.length > 0 ? (
                            <ResultGrid images={generatedImages} />
                        ) : (
                            <div className="text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <h3 className="mt-2 text-lg font-medium">Your new look will appear here</h3>
                                <p className="mt-1 text-sm">Upload a photo and describe a style to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Sticky Footer for Action Button */}
             <div className="sticky bottom-0 left-0 right-0 p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700 flex justify-center z-10">
                <button
                    onClick={handleGenerateClick}
                    disabled={isGenerateDisabled}
                    className="w-full md:w-1/2 lg:w-1/3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700"
                >
                    {isLoading ? 'Generating...' : 'Generate My Hairstyle'}
                </button>
            </div>
        </div>
    );
};

export default App;
