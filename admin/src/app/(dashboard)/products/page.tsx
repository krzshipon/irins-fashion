"use client";

import { useState } from "react";
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

// Mock data - will be replaced with API calls
const MOCK_PRODUCTS = [
    {
        id: "h1",
        sku: "IF-HJB-EM-001",
        name: "Premium Silk Hijab - Emerald",
        price: 1250,
        originalPrice: 1500,
        category: "Hijab",
        stock: 45,
        status: "active",
        image: "/images/products/hijab-emerald.png",
    },
    {
        id: "h2",
        sku: "IF-HJB-DR-002",
        name: "Chiffon Hijab - Dusty Rose",
        price: 850,
        category: "Hijab",
        stock: 120,
        status: "active",
        image: "/images/products/hijab-rose.png",
    },
    {
        id: "a1",
        sku: "IF-ABY-BK-001",
        name: "Classic Black Abaya",
        price: 4500,
        category: "Abaya",
        stock: 25,
        status: "active",
        image: "/images/product-abaya.png",
    },
    {
        id: "a2",
        sku: "IF-ABY-EM-002",
        name: "Embroidered Open Abaya",
        price: 6500,
        category: "Abaya",
        stock: 0,
        status: "out_of_stock",
        image: "/images/product-abaya.png",
    },
    {
        id: "d1",
        sku: "IF-DRS-FL-001",
        name: "Floral Maxi Dress",
        price: 3500,
        originalPrice: 3900,
        category: "Borkha",
        stock: 35,
        status: "active",
        image: "/images/product-dress.png",
    },
];

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [products] = useState(MOCK_PRODUCTS);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map((p) => p.category))];

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
                            {categories.map((cat) => (
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
                                            <div className="w-12 h-12 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-500" />
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
                                        <span className="text-sm text-gray-400">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <span className="text-sm font-semibold text-white">৳{product.price.toLocaleString()}</span>
                                            {product.originalPrice && (
                                                <span className="text-xs text-gray-500 line-through ml-2">
                                                    ৳{product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-400' : product.stock < 20 ? 'text-amber-400' : 'text-white'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'active'
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {product.status === 'active' ? 'Active' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filteredProducts.length}</span> of{" "}
                        <span className="font-medium text-white">{products.length}</span> products
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium">1</button>
                        <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
