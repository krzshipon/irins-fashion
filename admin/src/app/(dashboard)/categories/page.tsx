"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useDialog } from "@/components/Dialog";
import CategoryModal from "@/components/categories/CategoryModal";

import { categoriesService } from "@/services/categories.service";
import { Category } from "@/types/category";

export default function CategoriesPage() {
    const { showConfirm, showSuccess, showLoading, showError } = useDialog();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const data = await categoriesService.getAll();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setCategories([]);
            showError("Connection Error", "Failed to load categories. Please check your internet connection or try again later.");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingCategory(null);
        setShowModal(true);
    };

    const handleSave = async (categoryData: any) => {
        try {
            if (editingCategory) {
                await categoriesService.update(editingCategory.id, categoryData);
            } else {
                await categoriesService.create(categoryData);
            }
            // Refetch to get updated list
            await fetchCategories();
            setShowModal(false);
        } catch (error) {
            console.error("Failed to save category", error);
            throw error; // Re-throw for Modal to catch
        }
    };

    const handleDelete = (id: string) => {
        showConfirm(
            "Delete Category",
            "Are you sure you want to delete this category? This action cannot be undone.",
            async () => {
                showLoading("Deleting Category", "Please wait...");
                try {
                    await categoriesService.delete(id);
                    await fetchCategories();
                    showSuccess("Category Deleted", "The category has been deleted successfully.");
                } catch (error) {
                    console.error("Failed to delete category", error);
                    showError("Delete Failed", "Could not delete the category. Please try again.");
                }
            }
        );
    };

    const toggleStatus = (category: Category) => {
        const newStatus = !category.isActive;
        const action = newStatus ? "activate" : "deactivate";

        showConfirm(
            `${newStatus ? "Activate" : "Deactivate"} Category`,
            `Are you sure you want to ${action} this category? It will ${newStatus ? "appear" : "be hidden"} on the storefront.`,
            async () => {
                showLoading("Updating Status", "Please wait...");
                try {
                    await categoriesService.toggleStatus(category.id);
                    await fetchCategories();
                    showSuccess("Status Updated", `Category has been ${newStatus ? "activated" : "deactivated"} successfully.`);
                } catch (error) {
                    console.error("Failed to update status", error);
                    showError("Update Failed", "Could not update category status. Please try again.");
                }
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
                                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }} />
                                    ) : (
                                        <span>{category.icon || '📦'}</span>
                                    )}
                                    {/* Icon overlay for when image is present */}
                                    {category.image && category.icon && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xl backdrop-blur-[1px]">
                                            {category.icon}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.productCount || 0} products</p>
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
