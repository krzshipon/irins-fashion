"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Upload,
} from "lucide-react";
import { useDialog } from "@/components/Dialog";
import VariantManager, { ColorVariant } from "./VariantManager";

interface ProductFormProps {
    initialData?: any; // Replace with proper type when available
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const { showSuccess, showLoading, showConfirm } = useDialog();

    const [formData, setFormData] = useState(initialData || {
        name: "",
        slug: "",
        description: "",
        price: "",
        salePrice: "",
        category: "",
        sku: "", // Base SKU
        status: "Draft",
        images: [], // Base images (optional if variants cover everything)
        variants: [] as ColorVariant[],
        discount: { type: "percentage", value: 0 },
        badges: [] as string[] // Simple array for UI toggles (New, Bestseller)
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === "name" && !isEdit) {
            setFormData((prev: any) => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleVariantsChange = (newVariants: ColorVariant[]) => {
        setFormData((prev: any) => ({ ...prev, variants: newVariants }));
    };

    const handleDiscountChange = (field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            discount: { ...prev.discount, [field]: value }
        }));
    };

    const toggleBadge = (badge: string) => {
        setFormData((prev: any) => {
            const currentBadges = prev.badges || [];
            if (currentBadges.includes(badge)) {
                return { ...prev, badges: currentBadges.filter((b: string) => b !== badge) };
            } else {
                return { ...prev, badges: [...currentBadges, badge] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        showLoading(
            isEdit ? "Updating Product" : "Creating Product",
            "Please wait while we save your changes..."
        );

        // Simulate API call
        console.log("Submitting Product Data:", formData);
        await new Promise(resolve => setTimeout(resolve, 1500));

        showSuccess(
            isEdit ? "Product Updated" : "Product Created",
            `The product has been successfully ${isEdit ? 'updated' : 'created'}.`
        );

        router.push("/products");
    };

    const handleCancel = () => {
        showConfirm(
            "Discard Changes?",
            "Are you sure you want to discard your changes? All unsaved data will be lost.",
            () => router.back()
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Details */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="e.g., Premium Silk Hijab"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-gray-400 font-mono placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="e.g., premium-silk-hijab"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none resize-none h-32"
                                    placeholder="Enter detailed product description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media - General / Fallback */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">General Images <span className="text-sm font-normal text-gray-500 ml-2">(Optional fallback)</span></h3>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="text-gray-400 group-hover:text-emerald-400" size={24} />
                            </div>
                            <h4 className="text-white font-medium mb-1">Click to upload image</h4>
                            <p className="text-sm text-gray-500">or drag and drop here</p>
                        </div>
                    </div>

                    {/* Variants Manager (Replaces old Attributes) */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <VariantManager
                            variants={formData.variants || []}
                            onChange={handleVariantsChange}
                        />
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Status & Organization */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                                    required
                                >
                                    <option value="" className="text-gray-500">Select Category</option>
                                    <option value="Hijab">Hijab</option>
                                    <option value="Abaya">Abaya</option>
                                    <option value="Borkha">Borkha</option>
                                    <option value="Gown">Gown</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Marketing */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Marketing</h3>

                        {/* Discount */}
                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-medium text-gray-400">Discount</label>
                            <div className="flex gap-4">
                                <select
                                    value={formData.discount?.type || "percentage"}
                                    onChange={(e) => handleDiscountChange("type", e.target.value)}
                                    className="px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Amount (৳)</option>
                                </select>
                                <input
                                    type="number"
                                    value={formData.discount?.value || 0}
                                    onChange={(e) => handleDiscountChange("value", parseFloat(e.target.value))}
                                    className="flex-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-400">Badges</label>
                            <div className="flex flex-wrap gap-2">
                                {["New Arrival", "Bestseller", "Limited Edition"].map((badge) => (
                                    <button
                                        key={badge}
                                        type="button"
                                        onClick={() => toggleBadge(badge)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${formData.badges?.includes(badge)
                                                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                                            }`}
                                    >
                                        {badge}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Base Pricing (Fallback) */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Base Pricing</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Regular Price (৳)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="0.00"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Used if not overridden by variant.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Sale Price (৳)</label>
                                <input
                                    type="number"
                                    name="salePrice"
                                    value={formData.salePrice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Base SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="SKU-001"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/10">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm shadow-lg shadow-emerald-900/20"
                >
                    <Save size={18} />
                    {isEdit ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
}
