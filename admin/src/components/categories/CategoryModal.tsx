"use client";

import { useState, useEffect } from "react";
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
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        icon: "",
        image: "",
        description: "",
        isActive: true
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
                    isActive: initialData.isActive ?? true
                });
            } else {
                // Reset for new entry
                setFormData({
                    name: "",
                    slug: "",
                    icon: "📦",
                    image: "",
                    description: "",
                    isActive: true
                });
            }
        }
    }, [isOpen, initialData, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug
        if (name === "name") {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
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
            await onSave(formData);
            showSuccess(
                isEdit ? "Category Updated" : "Category Created",
                `Category has been successfully ${isEdit ? 'updated' : 'created'}.`
            );
            onClose();
        } catch (error: any) {
            console.error(error);

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

                                {/* Divider */}
                                <div className="hidden md:block w-px bg-white/10 my-1 self-stretch" />

                                {/* Image Input - Compact */}
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-medium text-gray-300">Featured Image</label>
                                    <div className="relative group">
                                        <div className="relative w-full h-24 bg-black/30 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:border-emerald-500/30 transition-all shadow-inner">
                                            {formData.image ? (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${formData.image})` }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-colors">
                                                    <Upload size={18} />
                                                    <span className="text-xs font-medium">Upload or paste URL</span>
                                                </div>
                                            )}

                                            <input
                                                type="text"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                placeholder="Image URL"
                                            />

                                            {/* Hover instructions overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity duration-200">
                                                <span className="text-xs text-white font-medium">Click to change image</span>
                                            </div>
                                        </div>

                                        {formData.image && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                                className="absolute -top-2 -right-2 p-1 bg-black/80 border border-white/10 text-white rounded-full hover:bg-red-500/80 transition-colors z-20 shadow-xl opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={10} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* General Info Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={14} /> Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category Name</label>
                                    <div className="relative">
                                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-gray-600"
                                            placeholder="e.g. Summer Collection"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">URL Slug</label>
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
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:border-emerald-500/50 focus:outline-none transition-colors placeholder:text-gray-600 resize-none"
                                        placeholder="Add a brief description for SEO and user guidance..."
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
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-900/20 transition-all font-medium text-sm flex items-center gap-2"
                        >
                            {isEdit ? <CheckCircle size={16} /> : <Upload size={16} />}
                            {isEdit ? "Update Category" : "Create Category"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
