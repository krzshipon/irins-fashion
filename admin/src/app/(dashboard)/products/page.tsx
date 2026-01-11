"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Package,
} from "lucide-react";
import { useDialog } from "@/components/Dialog";

import { productsService } from "@/services/products.service";

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const { showConfirm, showSuccess, showLoading, showError } = useDialog();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { products } = await productsService.getAll();
            setProducts(products || []);
        } catch (error) {
            console.error(error);
            showError("Error", "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id: string) => {
        showConfirm(
            "Delete Product",
            "Are you sure you want to delete this product? This action cannot be undone.",
            async () => {
                showLoading("Deleting Product", "Please wait while we delete the product...");
                try {
                    await productsService.delete(id);
                    setProducts(prev => prev.filter(p => p.id !== id));
                    showSuccess("Product Deleted", "The product has been successfully deleted.");
                } catch (error) {
                    console.error(error);
                    showError("Error", "Failed to delete product");
                }
            }
        );
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map((p) => p.category?.name).filter(Boolean))];

    if (loading) {
        return <div className="text-white p-8">Loading products...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-playfair">Products</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage your product catalog ({products.length} products)
                    </p>
                </div>
                <Link
                    href="/products/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm shadow-lg shadow-emerald-900/20"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-gray-300 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none transition-all"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat: any) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black/20 border-b border-white/10">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    SKU
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center relative">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">{product.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-400 font-mono">{product.sku}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-400">{product.category?.name || 'Uncategorized'}</span>
                                    </td>
                                    <td className="px-6 py-4">
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
                                                <div>
                                                    <span className="text-sm font-semibold text-white">৳{displayPrice.toLocaleString()}</span>
                                                    {showCrossedOut && crossedOutPrice && (
                                                        <span className="text-xs text-gray-500 line-through ml-2">
                                                            ৳{crossedOutPrice.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Stock aggregation if many variants? For now just use product.stock if available or sum variants? 
                                            The model doesn't have direct 'stock', it's on variants.
                                            Let's compute it.
                                        */}
                                        <span className={`text-sm font-medium ${(product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0) === 0 ? 'text-red-400' : 'text-white'
                                            }`}>
                                            {product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'Published'
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-white/5 text-gray-400'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/products/${product.id}/edit`}
                                                className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified for now) */}
                <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Total <span className="font-medium text-white">{filteredProducts.length}</span> products
                    </p>
                </div>
            </div>
        </div>
    );
}
