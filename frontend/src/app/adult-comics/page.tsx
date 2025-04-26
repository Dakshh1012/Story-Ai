"use client";

import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function AdultComics() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set timeout for 10 seconds
        const timer = setTimeout(() => {
            setLoading(false);
        }, 10000);

        // Clean up timer
        return () => clearTimeout(timer);
    }, []);

    const handleDownload = () => {
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = '/comic_book.pdf';
        link.download = 'comic_book.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {loading ? (
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-xl font-medium">Loading your comics...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    <h1 className="text-2xl font-bold">Your Comic is Ready!</h1>
                    <button
                        onClick={handleDownload}
                        className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Download Comic
                    </button>
                </div>
            )}
        </div>
    );
}