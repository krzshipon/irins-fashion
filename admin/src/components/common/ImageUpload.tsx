"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    folder?: string;
    label?: string;
}

export default function ImageUpload({ value, onChange, folder = "banners", label = "Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            // Backend interceptor wraps in { data: ... } or returns directly?
            // Usually we unwrap. Let's assume consistent wrapper or direct url depending on controller.
            // Upload controller calls Service.uploadFile which returns object { url: ... }.
            // Response interceptor might wrap it.
            const url = data.data?.url || data.url || data;

            if (typeof url === 'string') {
                onChange(url);
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error('Upload failed:', error);
            // Handle error visually if needed
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-400">{label}</label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="relative w-40 h-24 bg-black/20 border border-white/10 rounded-lg overflow-hidden shrink-0 group">
                    {value ? (
                        <>
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => onChange("")}
                                    className="p-1.5 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <ImageIcon size={24} />
                        </div>
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Loader2 className="animate-spin text-emerald-500" size={24} />
                        </div>
                    )}
                </div>

                {/* Upload Action */}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleUpload}
                    />

                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-emerald-500/30 transition-all text-sm text-gray-300 w-fit"
                        >
                            <Upload size={16} />
                            {uploading ? 'Uploading...' : 'Upload Image'}
                        </button>
                        <p className="text-xs text-gray-500">
                            Recommended dimension: 1920x600px (Hero). Max 5MB.
                        </p>
                    </div>

                    {/* Manual URL Input (Fallback) */}
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Or enter image URL..."
                        className="mt-2 w-full bg-transparent border-b border-white/10 py-1 text-xs text-gray-400 focus:outline-none focus:border-emerald-500/50 placeholder-gray-600"
                    />
                </div>
            </div>
        </div>
    );
}
