"use client";

import { useState, useEffect } from "react";
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
import { productsService } from "@/services/products.service";

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
    const { id } = params;
    const { showConfirm, showSuccess, showLoading, showError } = useDialog();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [activeLang, setActiveLang] = useState<'en' | 'bn'>('en');

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await productsService.getOne(id as string);
            setProduct(data);
            // flatten images for gallery: Global + Variant images
            // For now, let's just use global images + primary variant images
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        showConfirm(
            "Delete Product",
            "Are you sure you want to delete this product? This action cannot be undone.",
            async () => {
                showLoading("Deleting Product", "Please wait...");
                try {
                    await productsService.delete(id as string);
                    showSuccess("Deleted", "Product deleted successfully.");
                    router.push("/products");
                } catch (err) {
                    showError("Error", "Failed to delete product.");
                }
            }
        );
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>;
    if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>;

    // Aggregate all images
    const allImages = [
        ...(product.images || []),
        ...(product.colors?.flatMap((c: any) => c.images) || [])
    ].map((img: any) => img.url);

    const displayImage = allImages[activeImage] || "/placeholder.png";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white font-playfair">
                            {activeLang === 'en' ? product.name : (product.localizedNames?.bn || product.name)}
                        </h1>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.status === 'Published' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {product.status}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <Tag size={12} /> {product.category?.name}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-800 rounded-lg p-1 border border-white/10">
                        <button onClick={() => setActiveLang('en')} className={`px-3 py-1 text-xs rounded ${activeLang === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>EN</button>
                        <button onClick={() => setActiveLang('bn')} className={`px-3 py-1 text-xs rounded ${activeLang === 'bn' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}>BN</button>
                    </div>
                    <Link href={`/products/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                        <Edit size={16} /> Edit
                    </Link>
                    <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images & Desc */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-video bg-gray-800/50 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center relative group">
                            <img src={displayImage} alt="Product" className="w-full h-full object-contain" />
                        </div>
                        {allImages.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {allImages.map((src: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-16 h-16 shrink-0 rounded-lg border-2 overflow-hidden bg-white/5 ${activeImage === idx ? 'border-emerald-500' : 'border-transparent'}`}
                                    >
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                        <p className="text-gray-400 leading-relaxed text-sm whitespace-pre-wrap">
                            {activeLang === 'en' ? product.description : (product.localizedDescriptions?.bn || product.description)}
                        </p>
                    </div>

                    {/* Variants Table */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Inventory & Variants</h3>
                        <div className="space-y-4">
                            {product.colors?.map((color: any) => (
                                <div key={color.id} className="border border-white/10 rounded-lg overflow-hidden">
                                    <div className="bg-white/5 p-3 flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: color.code }}></div>
                                        <span className="font-medium text-white">{color.name} ({color.code})</span>
                                    </div>
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-black/20 text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-2">Size</th>
                                                <th className="px-4 py-2">Stock</th>
                                                <th className="px-4 py-2">Price Override</th>
                                                <th className="px-4 py-2">SKU</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {color.variants?.map((v: any) => (
                                                <tr key={v.id}>
                                                    <td className="px-4 py-2 text-white">{v.size}</td>
                                                    <td className="px-4 py-2">{v.stock}</td>
                                                    <td className="px-4 py-2">{v.price ? `৳${v.price}` : '-'}</td>
                                                    <td className="px-4 py-2 font-mono text-xs">{v.sku || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats/Info */}
                <div className="space-y-6">
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Pricing</h3>
                        {(() => {
                            const hasDiscount = product.discount?.value;
                            const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
                            const showCrossedOut = hasDiscount || hasOriginalPrice;
                            const crossedOutPrice = hasOriginalPrice ? product.originalPrice : (hasDiscount ? product.price : null);

                            // Calculate discounted price if discount exists
                            let displayPrice = product.price;
                            if (hasDiscount) {
                                displayPrice = product.discount.type === 'percentage'
                                    ? Math.round(product.price * (1 - product.discount.value / 100))
                                    : Math.max(0, product.price - product.discount.value);
                            }

                            return (
                                <>
                                    <div className="text-3xl font-bold text-white mb-1">৳{displayPrice.toLocaleString()}</div>
                                    {showCrossedOut && crossedOutPrice && (
                                        <div className="text-sm text-gray-500 line-through">৳{crossedOutPrice.toLocaleString()}</div>
                                    )}
                                </>
                            );
                        })()}

                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">SKU</span>
                                <span className="text-white font-mono">{product.sku}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Discount</span>
                                <span className="text-emerald-400">{product.discount?.value ? `${product.discount.value}${product.discount.type === 'percentage' ? '%' : '৳'} Off` : 'None'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Badges</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.badges?.map((b: any) => (
                                <span key={b.id} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
                                    {b.text}
                                </span>
                            ))}
                            {(!product.badges || product.badges.length === 0) && <span className="text-gray-500 text-sm">No badges</span>}
                        </div>
                    </div>

                    {product.sizeChart && (
                        <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Size Chart</h3>
                            <div className="rounded-lg overflow-hidden border border-white/10">
                                <img src={product.sizeChart} alt="Size Chart" className="w-full" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
