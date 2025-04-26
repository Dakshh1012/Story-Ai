"use client";

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { Spinner } from '@/components/ui/spinner';

export default function AdultBranching() {
    const [modificationPrompt, setModificationPrompt] = useState('');
    const [originalStory, setOriginalStory] = useState('');
    const [modifiedStory, setModifiedStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleModifyStory = async (e) => {
        e.preventDefault();
        
        if (!modificationPrompt.trim()) {
            setError('Please enter a modification prompt');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(' https://abe3-103-104-226-58.ngrok-free.app/modify_story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: modificationPrompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to modify story');
            }

            if (data.story) {
                // If we don't have an original story yet, set a placeholder
                if (!originalStory) {
                    setOriginalStory('Original murder mystery at Ravenwood Manor');
                }
                setModifiedStory(data.story);
            } else {
                throw new Error('No story returned from the server');
            }

        } catch (err) {
            setError(err.message || 'An error occurred while modifying the story');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseAsBase = () => {
        setOriginalStory(modifiedStory);
        setModifiedStory('');
        setModificationPrompt('');
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 py-20">
                <div className="w-full max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-6 text-center">Story Branching</h1>
                    <p className="text-slate-300 mb-8 text-center">
                        Create alternate storylines by modifying the murder mystery plot. Try inputs like 
                        "What if the detective was the killer?" or "Change the murder weapon to poison."
                    </p>

                    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
                        <form onSubmit={handleModifyStory} className="mb-6">
                            <label htmlFor="modification" className="block text-lg font-medium mb-2">
                                Enter your story modification:
                            </label>
                            <textarea
                                id="modification"
                                className="w-full h-32 p-4 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="e.g., What if the detective was the killer?"
                                value={modificationPrompt}
                                onChange={(e) => setModificationPrompt(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-medium flex items-center justify-center transition-colors duration-300"
                            >
                                {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                                {isLoading ? 'Generating...' : 'Modify Story'}
                            </button>
                        </form>

                        {error && (
                            <div className="p-4 mb-6 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
                                {error}
                            </div>
                        )}

                        {originalStory && !error && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3 flex items-center">
                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                    Original Storyline
                                </h2>
                                <div className="p-4 bg-slate-700/50 rounded-lg">
                                    <p className="text-slate-300">{originalStory}</p>
                                </div>
                            </div>
                        )}

                        {modifiedStory && !error && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3 flex items-center">
                                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                    Modified Storyline
                                </h2>
                                <div className="p-4 bg-slate-700/50 rounded-lg">
                                    <p className="text-slate-300 whitespace-pre-wrap">{modifiedStory}</p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button 
                                        onClick={handleUseAsBase}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Use as New Base Story
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 text-sm text-slate-400 border-t border-slate-700 pt-4">
                            <p className="mb-2"><span className="font-semibold">Tip:</span> You can create a branching narrative by using the modified story as your new base, then adding new changes.</p>
                            <p>Each modification creates a new branch in your story universe, allowing for multiple alternate endings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}