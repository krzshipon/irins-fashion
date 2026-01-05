"use client";

import { useState, useEffect, useRef } from "react";
import {
    X,
    Upload,
    Image as ImageIcon,
    Type,
    Link as LinkIcon,
    FileText,
    CheckCircle,
    XCircle,
    Box
} from "lucide-react";
import { useDialog } from "@/components/Dialog";
import { uploadService } from "@/services/upload.service";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void> | void;
    initialData?: any;
    isEdit?: boolean;
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    isEdit = false
}: CategoryModalProps) {
    const { showLoading, showSuccess, showError } = useDialog();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false); // Used only for loading state during final submit if needed

    const [activeTab, setActiveTab] = useState<'en' | 'bn'>('en');

    // Helper to safety get localized text
    const getLocalized = (data: any, field: string, locale: string) => {
        if (!data) return "";
        if (field === 'name' && locale === 'en') return data.name || "";
        if (field === 'description' && locale === 'en') return data.description || "";

        const localized = field === 'name' ? data.localizedNames : data.localizedDescriptions;
        return localized?.[locale] || "";
    };

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        icon: "",
        image: "",
        description: "",
        isActive: true,
        localizedNames: { bn: "" } as Record<string, string>,
        localizedDescriptions: { bn: "" } as Record<string, string>
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData && isEdit) {
                setFormData({
                    name: initialData.name || "",
                    slug: initialData.slug || "",
                    icon: initialData.icon || "",
                    image: initialData.image || "",
                    description: initialData.description || "",
                    isActive: initialData.isActive ?? true,
                    localizedNames: initialData.localizedNames || { bn: "" },
                    localizedDescriptions: initialData.localizedDescriptions || { bn: "" }
                });
                setPreviewUrl(initialData.image || "");
                setSelectedFile(null);
            } else {
                // Reset for new entry
                setFormData({
                    name: "",
                    slug: "",
                    icon: "📦",
                    image: "",
                    description: "",
                    isActive: true,
                    localizedNames: { bn: "" },
                    localizedDescriptions: { bn: "" }
                });
                setPreviewUrl("");
                setSelectedFile(null);
            }
            setActiveTab('en');
        }
    }, [isOpen, initialData, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (activeTab === 'en') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            // Auto-generate slug only from English name
            if (name === "name") {
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                }));
            }
        } else {
            // Handle Bengali updates
            if (name === 'name') {
                setFormData(prev => ({
                    ...prev,
                    localizedNames: { ...prev.localizedNames, bn: value }
                }));
            } else if (name === 'description') {
                setFormData(prev => ({
                    ...prev,
                    localizedDescriptions: { ...prev.localizedDescriptions, bn: value }
                }));
            }
        }

        // Image and Icon handle separately or shared? Icon is shared.
        if (name === "image" || name === "icon" || name === "slug") {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            // If user manually edits image URL
            if (name === "image") {
                setPreviewUrl(value);
                setSelectedFile(null);
            }
        }
    };

    const getValue = (field: 'name' | 'description') => {
        if (activeTab === 'en') {
            return formData[field];
        }
        return field === 'name' ? formData.localizedNames.bn : formData.localizedDescriptions.bn;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name) return;

        showLoading(
            isEdit ? "Updating Category" : "Creating Category",
            "Please wait while we save your changes..."
        );

        try {
            let imageUrl = formData.image;

            // Upload image if file selected
            if (selectedFile) {
                setIsUploading(true); // Optional visual cue
                try {
                    imageUrl = await uploadService.uploadImage(selectedFile, 'categories');
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    showError("Upload Failed", "Could not upload the image. Please try again.");
                    setIsUploading(false);
                    return;
                }
                setIsUploading(false);
            }

            // Save with the final image URL (either expected URL or newly uploaded one)
            await onSave({ ...formData, image: imageUrl });

            showSuccess(
                isEdit ? "Category Updated" : "Category Created",
                `Category has been successfully ${isEdit ? 'updated' : 'created'}.`
            );
            onClose();
        } catch (error: any) {
            console.error(error);
            setIsUploading(false);

            // Extract error message
            let errorMessage = "Failed to save category. Please check your connection and try again.";

            if (error.response?.data?.message) {
                const message = error.response.data.message;
                if (Array.isArray(message)) {
                    errorMessage = message.join(". ");
                } else {
                    errorMessage = message;
                }
            }

            showError(
                "Operation Failed",
                errorMessage
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-white font-playfair">
                            {isEdit ? "Edit Category" : "New Category"}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {isEdit ? "Update category details and settings" : "Add a new product category to your store"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <form id="categoryForm" onSubmit={handleSubmit} className="space-y-8">

                        {/* Visual Identity Section */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon size={14} /> Visual Identity
                            </h3>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col md:flex-row gap-6">
                                {/* Image Input - Storage Integrated */}
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Featured Image</label>
                                    <div className="relative group">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative w-full h-64 bg-black/30 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:border-emerald-500/30 transition-all shadow-inner group-hover:bg-white/5"
                                        >
                                            {previewUrl ? (
                                                <div
                                                    className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${previewUrl})` }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-500 group-hover:text-emerald-400 transition-colors">
                                                    <Upload size={18} />
                                                    <span className="text-xs font-medium">Click to upload image</span>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setSelectedFile(file);
                                                        setPreviewUrl(URL.createObjectURL(file));
                                                        // Clear manual image URL input so we know to use the file
                                                        setFormData(prev => ({ ...prev, image: "" }));
                                                    }
                                                }}
                                            />
                                        </div>

                                        {previewUrl && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewUrl("");
                                                    setSelectedFile(null);
                                                    setFormData(prev => ({ ...prev, image: "" }));
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                                }}
                                                className="absolute -top-2 -right-2 p-1 bg-black/80 border border-white/10 text-white rounded-full hover:bg-red-500/80 transition-colors z-20 shadow-xl opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </div>

                                    {/* URL Fallback */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-gray-300 text-xs focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
                                            placeholder="Or paste image URL here..."
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="hidden md:block w-px bg-white/10 my-1 self-stretch" />

                                {/* Icon Input - Compact */}
                                <div className="flex flex-row md:flex-col gap-3 min-w-[120px]">
                                    <div className="space-y-1.5 flex-1">
                                        <label className="text-xs font-medium text-gray-300">Icon</label>
                                        <div className="flex gap-3">
                                            <div className="w-12 h-12 bg-black/30 rounded-lg border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                                {formData.icon || "📦"}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    name="icon"
                                                    value={formData.icon}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-gray-600 text-center"
                                                    placeholder="Emoji"
                                                />
                                                <p className="text-[10px] text-gray-500 mt-1 leading-tight">Nav menu icon</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* General Info Section */}
                        <div className="h-px bg-white/5" />

                        {/* General Info Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} /> Basic Information
                                </h3>

                                {/* Language Tabs */}
                                <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('en')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'en'
                                            ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        English
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('bn')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'bn'
                                            ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        Bengali
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Category Name <span className="text-emerald-500/50 text-xs ml-1">({activeTab.toUpperCase()})</span>
                                    </label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={getValue('name')}
                                            onChange={handleChange}
                                            required={activeTab === 'en'}
                                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
                                            placeholder={activeTab === 'en' ? "e.g. Summer Collection" : "উদাহরণ: গ্রীষ্মকালীন সংগ্রহ"}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">URL Slug <span className="text-gray-600 text-xs">(Global)</span></label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-gray-400 font-mono text-sm focus:border-emerald-500/50 focus:outline-none transition-colors"
                                            placeholder="e.g. summer-collection"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        Description <span className="text-emerald-500/50 text-xs ml-1">({activeTab.toUpperCase()})</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={getValue('description')}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-gray-600 resize-none"
                                        placeholder={activeTab === 'en' ? "Add a brief description..." : "সংক্ষিপ্ত বিবরণ যোগ করুন..."}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Settings Section */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                        <Box size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white">Category Status</h4>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formData.isActive
                                                ? "Category is visible to customers on the storefront."
                                                : "Category is hidden from the storefront."}
                                        </p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/20 rounded-b-2xl flex items-center justify-between gap-4">
                    <div className="text-xs text-gray-500">
                        {isEdit ? "Last edited just now" : "New category will be added to top of list"}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="categoryForm"
                            disabled={isUploading}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-900/20 transition-all font-medium text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    {isEdit ? <CheckCircle size={16} /> : <Upload size={16} />}
                                    {isEdit ? "Update Category" : "Create Category"}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
