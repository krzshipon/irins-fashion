"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useDialog } from "@/components/Dialog";
import CategoryModal from "@/components/categories/CategoryModal";

import { categoriesService } from "@/services/categories.service";
import { Category } from "@/types/category";

// DnD Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableCategoryItem({ category, toggleStatus, handleEdit, handleDelete }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-gray-800/50 backdrop-blur-xl rounded-xl border ${category.isActive ? 'border-white/10' : 'border-dashed border-white/5 opacity-75'} p-6 hover:border-white/20 transition-all group overflow-hidden relative`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-4 p-1 rounded hover:bg-white/10 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-colors"
            >
                <GripVertical size={18} />
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${category.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'
                    }`}>
                    {category.isActive ? 'Active' : 'Disabled'}
                </span>
            </div>

            <div className="flex items-start justify-between mb-6 pl-8"> {/* Added padding-left for handle space */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden relative">
                        {category.image ? (
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }} />
                        ) : (
                            <span>{category.icon || '📦'}</span>
                        )}
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
    );
}

export default function CategoriesPage() {
    const { showConfirm, showSuccess, showLoading, showError } = useDialog();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null); // For drag overlay

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Trigger API update in background
                const orderedIds = newOrder.map(c => c.id);
                categoriesService.reorder(orderedIds).catch(err => {
                    console.error("Failed to reorder", err);
                    showError("Reorder Failed", "Could not save the new order.");
                    // Revert on failure? Ideally yes, but keeping it simple for now.
                });

                return newOrder;
            });
        }
    };

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

            {/* Categories Grid - Sortable */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
            >
                <SortableContext
                    items={categories.map(c => c.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <SortableCategoryItem
                                key={category.id}
                                category={category}
                                toggleStatus={toggleStatus}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>

                {/* Drag Overlay for smooth visuals */}
                <DragOverlay>
                    {activeId ? (
                        <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-emerald-500/50 p-6 shadow-2xl scale-105 cursor-grabbing">
                            {/* Simplified preview of the card */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-xl flex items-center justify-center text-3xl">
                                    {categories.find(c => c.id === activeId)?.icon || '📦'}
                                </div>
                                <h3 className="font-bold text-white text-lg">{categories.find(c => c.id === activeId)?.name}</h3>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

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
