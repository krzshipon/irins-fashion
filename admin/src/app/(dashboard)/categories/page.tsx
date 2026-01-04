"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useDialog } from "@/components/Dialog";
import CategoryModal from "@/components/categories/CategoryModal";

// Mock data - will be replaced with API calls
const MOCK_CATEGORIES = [
    {
        id: "1",
        name: "Hijab",
        slug: "hijab",
        productCount: 24,
        icon: "🧕",
        image: "/images/category-hijab.png",
        isActive: true,
        description: "Premium hijabs in silk, chiffon, and jersey"
    },
    {
        id: "2",
        name: "Abaya",
        slug: "abaya",
        productCount: 18,
        icon: "👗",
        image: "/images/category-abaya.png",
        isActive: true,
        description: "Classic and modern abaya designs"
    },
    {
        id: "3",
        name: "Borkha",
        slug: "borkha",
        productCount: 15,
        icon: "👗",
        image: "/images/category-borkha.png",
        isActive: true,
        description: "Traditional and contemporary borkha styles"
    },
    {
        id: "4",
        name: "Gown",
        slug: "gown",
        productCount: 12,
        icon: "👗",
        image: "/images/category-gown.png",
        isActive: false,
        description: "Elegant gowns for special occasions"
    },
    {
        id: "5",
        name: "Accessories",
        slug: "accessories",
        productCount: 35,
        icon: "👜",
        image: "/images/category-accessories.png",
        isActive: true,
        description: "Handbags, jewelry, and more"
    },
];

export default function CategoriesPage() {
    const { showConfirm, showSuccess } = useDialog();
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<typeof MOCK_CATEGORIES[0] | null>(null);

    const handleEdit = (category: typeof MOCK_CATEGORIES[0]) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleSave = (categoryData: any) => {
        if (editingCategory) {
            setCategories(categories.map(c =>
                c.id === editingCategory.id
                    ? { ...c, ...categoryData }
                    : c
            ));
        } else {
            setCategories([...categories, {
                id: String(Date.now()),
                ...categoryData,
                productCount: 0,
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        showConfirm(
            "Delete Category",
            "Are you sure you want to delete this category? This action cannot be undone.",
            () => {
                setCategories(categories.filter(c => c.id !== id));
                showSuccess("Category Deleted", "The category has been deleted successfully.");
            }
        );
    };

    const toggleStatus = (category: typeof MOCK_CATEGORIES[0]) => {
        const newStatus = !category.isActive;
        const action = newStatus ? "activate" : "deactivate";

        showConfirm(
            `${newStatus ? "Activate" : "Deactivate"} Category`,
            `Are you sure you want to ${action} this category? It will ${newStatus ? "appear" : "be hidden"} on the storefront.`,
            () => {
                setCategories(categories.map(c =>
                    c.id === category.id ? { ...c, isActive: newStatus } : c
                ));
                showSuccess("Status Updated", `Category has been ${newStatus ? "activated" : "deactivated"} successfully.`);
            }
        );
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
                        className={`bg-gray-800/50 backdrop-blur-xl rounded-xl border ${category.isActive ? 'border-white/10' : 'border-dashed border-white/5 opacity-75'} p-6 hover:border-white/20 transition-all group overflow-hidden relative`}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${category.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'
                                }`}>
                                {category.isActive ? 'Active' : 'Disabled'}
                            </span>
                        </div>

                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden relative">
                                    {category.image ? (
                                        // In a real app, use Next.js Image component
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }} />
                                    ) : (
                                        <span>{category.icon}</span>
                                    )}
                                    {/* Icon overlay for when image is present */}
                                    {category.image && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xl backdrop-blur-[1px]">
                                            {category.icon}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.productCount} products</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">{category.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-xs text-gray-500 font-mono">/{category.slug}</span>
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={category.isActive}
                                        onChange={() => toggleStatus(category)}
                                    />
                                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
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
            <CategoryModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                initialData={editingCategory}
                isEdit={!!editingCategory}
            />
        </div>
    );
}
