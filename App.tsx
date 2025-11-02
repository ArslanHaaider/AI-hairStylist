
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultGrid } from './components/ResultGrid';
import { Loader } from './components/Loader';
import { generateHairstyles } from './services/geminiService';
import { GeneratedImage } from './types';

// A helper component for the step indicators
const StepIndicator: React.FC<{ number: number; title: string; description: string }> = ({ number, title, description }) => (
    <div>
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg">
                {number}
            </div>
            <div>
                <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    </div>
);


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
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-purple-500/30">
            <header className="py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-20">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
                           <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="url(#grad1)"/>
                           <path d="M12 6C9.79 6 8 7.79 8 10C8 11.13 8.44 12.14 9.14 12.86L12 16L14.86 12.86C15.56 12.14 16 11.13 16 10C16 7.79 14.21 6 12 6Z" fill="url(#grad2)"/>
                            <defs>
                                <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="22">
                                <stop offset="0%" stopColor="currentColor"/>
                                <stop offset="100%" stopColor="#E879F9"/>
                                </linearGradient>
                                <linearGradient id="grad2" x1="8" y1="6" x2="16" y2="16">
                                <stop offset="0%" stopColor="#D946EF"/>
                                <stop offset="100%" stopColor="#F472B6"/>
                                </linearGradient>
                            </defs>
                        </svg>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                            AI Hairstyle Try-On
                        </h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Control Panel */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-2xl shadow-black/20">
                             <StepIndicator number={1} title="Upload Your Headshot" description="For best results, use a clear, front-facing photo." />
                             <div className="mt-6">
                                <ImageUploader onImageUpload={handleImageUpload} />
                             </div>
                        </div>
                        
                        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-2xl shadow-black/20">
                             <StepIndicator number={2} title="Describe Your Dream Hairstyle" description='Be creative! Try "long curly blonde hair".' />
                             <div className="mt-6">
                                <textarea
                                    value={hairstylePrompt}
                                    onChange={(e) => setHairstylePrompt(e.target.value)}
                                    placeholder="e.g., a vibrant pink mohawk with shaved sides"
                                    className="w-full h-28 p-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder-slate-500"
                                    aria-label="Hairstyle description"
                                />
                             </div>
                        </div>
                         {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg text-center font-medium">{error}</div>}
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-2xl shadow-black/20 min-h-[500px] flex flex-col justify-center items-center">
                        {isLoading ? (
                            <Loader />
                        ) : generatedImages.length > 0 ? (
                            <ResultGrid images={generatedImages} />
                        ) : (
                            <div className="text-center text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <h3 className="mt-4 text-xl font-semibold text-slate-300">Your New Look Awaits</h3>
                                <p className="mt-2 text-sm max-w-sm mx-auto">Upload a photo, describe the hairstyle you want, and click the generate button to see the magic happen.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Sticky Footer for Action Button */}
             <div className="sticky bottom-0 left-0 right-0 p-4 bg-slate-900/60 backdrop-blur-md border-t border-slate-800 flex justify-center z-10">
                <button
                    onClick={handleGenerateClick}
                    disabled={isGenerateDisabled}
                    className="group relative w-full md:w-1/2 lg:w-1/3 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg overflow-hidden
                               hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 
                               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700"
                >
                    <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                    <span className="relative flex items-center justify-center gap-2">
                        {isLoading ? 'Generating...' : 'Generate My Hairstyle'}
                        {!isLoading && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default App;
