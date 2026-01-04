"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";

// Mock data - will be replaced with API calls
const MOCK_CATEGORIES = [
    { id: "1", name: "Hijab", slug: "hijab", productCount: 24, icon: "🧕", description: "Premium hijabs in silk, chiffon, and jersey" },
    { id: "2", name: "Abaya", slug: "abaya", productCount: 18, icon: "👗", description: "Classic and modern abaya designs" },
    { id: "3", name: "Borkha", slug: "borkha", productCount: 15, icon: "👗", description: "Traditional and contemporary borkha styles" },
    { id: "4", name: "Gown", slug: "gown", productCount: 12, icon: "👗", description: "Elegant gowns for special occasions" },
    { id: "5", name: "Accessories", slug: "accessories", productCount: 35, icon: "👜", description: "Handbags, jewelry, and more" },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<typeof MOCK_CATEGORIES[0] | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", icon: "", description: "" });

    const handleEdit = (category: typeof MOCK_CATEGORIES[0]) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            description: category.description,
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setFormData({ name: "", slug: "", icon: "📦", description: "" });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingCategory) {
            setCategories(categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, ...formData }
                    : c
            ));
        } else {
            setCategories([...categories, {
                id: String(Date.now()),
                ...formData,
                productCount: 0,
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-playfair">Categories</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Organize your products into categories
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm shadow-lg shadow-emerald-900/20"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-700/50 rounded-xl flex items-center justify-center text-3xl">
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.productCount} products</p>
                                </div>
                            </div>
                            <button className="p-2 text-gray-600 hover:text-gray-400 cursor-grab">
                                <GripVertical size={18} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{category.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-xs text-gray-500 font-mono">/{category.slug}</span>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Icon</label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-2xl text-center text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="📦"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        name: e.target.value,
                                        slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                    })}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="Category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white font-mono placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none"
                                    placeholder="category-slug"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none resize-none"
                                    rows={3}
                                    placeholder="Brief description of the category"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm"
                            >
                                {editingCategory ? "Save Changes" : "Add Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
