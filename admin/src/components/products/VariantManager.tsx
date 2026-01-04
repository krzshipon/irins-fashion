"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, X, ChevronDown, ChevronUp, GripVertical, AlertCircle } from "lucide-react";
import { useDialog } from "@/components/Dialog";

// Types matching our implementation plan
export interface SizeVariant {
    id: string;
    size: string;
    price: string; // Using string input for better UX handling
    stock: string;
    sku: string;
}

export interface ColorVariant {
    id: string;
    colorName: string;
    colorCode: string;
    images: string[];
    sizes: SizeVariant[];
}

interface VariantManagerProps {
    variants: ColorVariant[];
    onChange: (variants: ColorVariant[]) => void;
}

export default function VariantManager({ variants, onChange }: VariantManagerProps) {
    const { showConfirm } = useDialog();
    const [expandedColor, setExpandedColor] = useState<string | null>(variants[0]?.id || null);

    const toggleExpand = (id: string) => {
        setExpandedColor(expandedColor === id ? null : id);
    };

    // --- Color Variant Handlers ---

    const addColorVariant = () => {
        const newColor: ColorVariant = {
            id: String(Date.now()),
            colorName: "",
            colorCode: "#000000",
            images: [],
            sizes: [{ id: String(Date.now() + 1), size: "", price: "", stock: "", sku: "" }]
        };
        onChange([...variants, newColor]);
        setExpandedColor(newColor.id);
    };

    const removeColorVariant = (id: string) => {
        showConfirm(
            "Delete Color Variant?",
            "This will delete all sizes and images associated with this color. Are you sure?",
            () => {
                onChange(variants.filter(v => v.id !== id));
            }
        );
    };

    const updateColorVariant = (id: string, field: keyof ColorVariant, value: any) => {
        onChange(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
    };

    // --- Image Handlers ---

    const addImageToColor = (colorId: string) => {
        // In a real app, this would trigger a file picker or media library
        // For now simulating adding a placeholder URL
        const url = `https://placehold.co/400x600/1e293b/FFF?text=Product+Image`; // Placeholder
        const variant = variants.find(v => v.id === colorId);
        if (variant) {
            updateColorVariant(colorId, "images", [...variant.images, url]);
        }
    };

    const removeImageFromColor = (colorId: string, index: number) => {
        const variant = variants.find(v => v.id === colorId);
        if (variant) {
            const newImages = [...variant.images];
            newImages.splice(index, 1);
            updateColorVariant(colorId, "images", newImages);
        }
    };

    // --- Size Variant Handlers ---

    const addSizeToColor = (colorId: string) => {
        const variant = variants.find(v => v.id === colorId);
        if (variant) {
            const newSize: SizeVariant = {
                id: String(Date.now()),
                size: "",
                price: "",
                stock: "",
                sku: ""
            };
            updateColorVariant(colorId, "sizes", [...variant.sizes, newSize]);
        }
    };

    const removeSizeFromColor = (colorId: string, sizeId: string) => {
        const variant = variants.find(v => v.id === colorId);
        if (variant) {
            updateColorVariant(colorId, "sizes", variant.sizes.filter(s => s.id !== sizeId));
        }
    };

    const updateSize = (colorId: string, sizeId: string, field: keyof SizeVariant, value: string) => {
        const variant = variants.find(v => v.id === colorId);
        if (variant) {
            const newSizes = variant.sizes.map(s =>
                s.id === sizeId ? { ...s, [field]: value } : s
            );
            updateColorVariant(colorId, "sizes", newSizes);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Product Variants</h3>
                    <p className="text-sm text-gray-400">Manage colors, specific images, and size inventory.</p>
                </div>
                <button
                    type="button"
                    onClick={addColorVariant}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-600/30 transition-colors font-medium text-sm"
                >
                    <Plus size={16} /> Add Color Group
                </button>
            </div>

            {variants.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center bg-gray-900/50">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-500">
                        <GripVertical size={24} />
                    </div>
                    <p className="text-gray-400 font-medium">No variants added yet</p>
                    <p className="text-xs text-gray-600 mt-1">Add a color group to start defining product options.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {variants.map((colorVariant) => (
                        <div
                            key={colorVariant.id}
                            className={`bg-gray-800/40 backdrop-blur-sm border rounded-xl overflow-hidden transition-all ${expandedColor === colorVariant.id ? 'border-emerald-500/30 ring-1 ring-emerald-500/30' : 'border-white/10'
                                }`}
                        >
                            {/* Color Header / Summary */}
                            <div
                                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => toggleExpand(colorVariant.id)}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg border border-white/20 shadow-inner flex shrink-0"
                                    style={{ backgroundColor: colorVariant.colorCode }}
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-white">
                                        {colorVariant.colorName || "Unnamed Color"}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {colorVariant.sizes.length} sizes, {colorVariant.images.length} images
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeColorVariant(colorVariant.id); }}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="text-gray-500">
                                        {expandedColor === colorVariant.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedColor === colorVariant.id && (
                                <div className="p-6 border-t border-white/10 bg-black/20 space-y-8 animate-in slide-in-from-top-2 duration-200">

                                    {/* 1. Color Settings */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400 uppercase">Color Name</label>
                                            <input
                                                type="text"
                                                value={colorVariant.colorName}
                                                onChange={(e) => updateColorVariant(colorVariant.id, "colorName", e.target.value)}
                                                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500/50 focus:outline-none"
                                                placeholder="e.g. Royal Blue"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400 uppercase">Color Hex Code</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="color"
                                                    value={colorVariant.colorCode}
                                                    onChange={(e) => updateColorVariant(colorVariant.id, "colorCode", e.target.value)}
                                                    className="h-10 w-10 rounded border border-white/10 p-0 bg-transparent cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={colorVariant.colorCode}
                                                    onChange={(e) => updateColorVariant(colorVariant.id, "colorCode", e.target.value)}
                                                    className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white font-mono focus:border-emerald-500/50 focus:outline-none"
                                                    placeholder="#000000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Color Images */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-gray-400 uppercase">
                                                Images <span className="text-gray-600">(Specific to {colorVariant.colorName})</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => addImageToColor(colorVariant.id)}
                                                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add Image
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {colorVariant.images.map((img, idx) => (
                                                <div key={idx} className="relative group aspect-square rounded-lg border border-white/10 bg-black/30 overflow-hidden">
                                                    {/* In a real app, use Next.js Image */}
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center"
                                                        style={{ backgroundImage: `url(${img})` }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageFromColor(colorVariant.id, idx)}
                                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Empty State / Upload Placeholder */}
                                            {colorVariant.images.length === 0 && (
                                                <div
                                                    onClick={() => addImageToColor(colorVariant.id)}
                                                    className="aspect-square rounded-lg border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-gray-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 cursor-pointer transition-all"
                                                >
                                                    <ImageIcon size={20} className="mb-2" />
                                                    <span className="text-[10px] uppercase font-bold tracking-wider">Add</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. Sizes Table */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-gray-400 uppercase">Size Inventory & Pricing</label>
                                            <button
                                                type="button"
                                                onClick={() => addSizeToColor(colorVariant.id)}
                                                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Add Size
                                            </button>
                                        </div>

                                        <div className="overflow-hidden border border-white/10 rounded-lg">
                                            <table className="w-full text-left text-sm text-gray-400">
                                                <thead className="bg-white/5 text-xs uppercase font-medium">
                                                    <tr>
                                                        <th className="px-4 py-3">Size Label</th>
                                                        <th className="px-4 py-3">Price Override</th>
                                                        <th className="px-4 py-3">Stock</th>
                                                        <th className="px-4 py-3">SKU</th>
                                                        <th className="px-4 py-3 w-10"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 bg-black/10">
                                                    {colorVariant.sizes.map((size) => (
                                                        <tr key={size.id} className="group hover:bg-white/5 transition-colors">
                                                            <td className="p-2">
                                                                <input
                                                                    type="text"
                                                                    value={size.size}
                                                                    onChange={(e) => updateSize(colorVariant.id, size.id, "size", e.target.value)}
                                                                    className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-emerald-500/50 rounded px-2 py-1 text-white focus:outline-none focus:bg-black/20"
                                                                    placeholder="e.g. XL"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={size.price}
                                                                    onChange={(e) => updateSize(colorVariant.id, size.id, "price", e.target.value)}
                                                                    className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-emerald-500/50 rounded px-2 py-1 text-white focus:outline-none focus:bg-black/20"
                                                                    placeholder="Same as base"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    value={size.stock}
                                                                    onChange={(e) => updateSize(colorVariant.id, size.id, "stock", e.target.value)}
                                                                    className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-emerald-500/50 rounded px-2 py-1 text-white focus:outline-none focus:bg-black/20"
                                                                    placeholder="0"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="text"
                                                                    value={size.sku}
                                                                    onChange={(e) => updateSize(colorVariant.id, size.id, "sku", e.target.value)}
                                                                    className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-emerald-500/50 rounded px-2 py-1 text-white focus:outline-none focus:bg-black/20 font-mono text-xs"
                                                                    placeholder="Optional"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSizeFromColor(colorVariant.id, size.id)}
                                                                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {colorVariant.sizes.length === 0 && (
                                                <div className="p-4 text-center text-xs text-gray-500 italic">
                                                    No sizes defined. Add a size to manage stock.
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <AlertCircle size={10} />
                                            Leave price blank to use the product's base price.
                                        </p>
                                    </div>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
