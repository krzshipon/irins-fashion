"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
    ChevronLeft,
    Edit,
    Trash2,
    Package,
    Tag,
    DollarSign,
    ShoppingBag,
    Image as ImageIcon,
    Eye
} from "lucide-react";
import { useDialog } from "@/components/Dialog";

// Mock Data
const MOCK_PRODUCT = {
    id: "1",
    name: "Premium Silk Hijab - Midnight Blue",
    description: "Experience the luxury of our Premium Silk Hijab. Crafted from 100% pure silk, this hijab offers a smooth, lightweight feel and a subtle sheen that elevates any outfit. Perfect for special occasions or adding a touch of elegance to your everyday look.",
    price: 1250,
    salePrice: 1050,
    stock: 45,
    sku: "SKU-HJB-001",
    category: "Hijab",
    status: "Published",
    images: ["/images/hijab-blue.jpg", "/images/hijab-blue-2.jpg", "/images/hijab-blue-3.jpg"],
    attributes: [
        { name: "Material", value: "100% Silk" },
        { name: "Size", value: "180cm x 70cm" },
        { name: "Color", value: "Midnight Blue" },
    ]
};

export default function ProductDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { showConfirm, showSuccess, showLoading } = useDialog();
    const [activeImage, setActiveImage] = useState(0);

    const handleDelete = () => {
        showConfirm(
            "Delete Product",
            "Are you sure you want to delete this product? This action cannot be undone.",
            async () => {
                showLoading("Deleting Product", "Please wait while we delete the product...");
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                showSuccess("Product Deleted", "The product has been successfully deleted.");
                router.push("/products");
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white font-playfair">{MOCK_PRODUCT.name}</h1>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${MOCK_PRODUCT.status === 'Published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                {MOCK_PRODUCT.status}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <Tag size={12} /> {MOCK_PRODUCT.category}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/products/${params.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                        <Edit size={16} />
                        Edit Product
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image */}
                    <div className="aspect-video bg-gray-800/50 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center relative group">
                        <ImageIcon className="text-gray-600" size={48} />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-medium">View Fullscreen</p>
                        </div>
                    </div>
                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map((idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`aspect-square rounded-lg border-2 flex items-center justify-center bg-gray-800/30 transition-all ${activeImage === idx ? 'border-emerald-500' : 'border-transparent hover:border-white/20'
                                    }`}
                            >
                                <ImageIcon className="text-gray-600" size={24} />
                            </button>
                        ))}
                    </div>

                    {/* Product Details Card */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {MOCK_PRODUCT.description}
                        </p>

                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-white mb-4">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MOCK_PRODUCT.attributes.map((attr, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                                        <span className="text-gray-500 text-sm">{attr.name}</span>
                                        <span className="text-white text-sm font-medium">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Info & Stats */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Pricing & Stock</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <span className="text-gray-400 flex items-center gap-2 text-sm">
                                    <DollarSign size={16} /> Price
                                </span>
                                <div className="text-right">
                                    <span className="block text-xl font-bold text-white">৳{MOCK_PRODUCT.salePrice}</span>
                                    {MOCK_PRODUCT.salePrice < MOCK_PRODUCT.price && (
                                        <span className="text-sm text-gray-500 line-through">৳{MOCK_PRODUCT.price}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <span className="text-gray-400 flex items-center gap-2 text-sm">
                                    <Package size={16} /> Stock Status
                                </span>
                                <div className="text-right">
                                    <span className="block text-white font-medium">{MOCK_PRODUCT.stock} units</span>
                                    <span className="text-xs text-emerald-400">In Stock</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 flex items-center gap-2 text-sm">
                                    <Tag size={16} /> SKU
                                </span>
                                <span className="text-white font-mono text-sm">{MOCK_PRODUCT.sku}</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <ShoppingBag size={18} />
                                    <span className="text-xs font-bold">+12%</span>
                                </div>
                                <p className="text-2xl font-bold text-white">24</p>
                                <p className="text-xs text-gray-500 mt-1">Orders this month</p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    <Eye size={18} />
                                    <span className="text-xs font-bold">+5%</span>
                                </div>
                                <p className="text-2xl font-bold text-white">1.2k</p>
                                <p className="text-xs text-gray-500 mt-1">Views this month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
