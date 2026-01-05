"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Upload,
    Globe,
    FileText,
    Trash2,
    X
} from "lucide-react";
import { useDialog } from "@/components/Dialog";
import VariantManager, { ColorVariant } from "./VariantManager";
import { categoriesService } from "@/services/categories.service";
import { productsService } from "@/services/products.service";
import { Category } from "@/types/category";
import { uploadService } from "@/services/upload.service";

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

type Lang = 'en' | 'bn';

const transformInitialData = (data: any) => {
    if (!data) return null;
    return {
        ...data,
        price: data.price?.toString() || "",
        originalPrice: data.originalPrice?.toString() || "",
        categoryName: data.category?.id || data.categoryId || "",
        badges: data.badges?.map((b: any) => b.text) || [],
        // Transform Backend Colors -> Frontend Variants
        variants: data.colors?.map((c: any) => ({
            id: c.id,
            colorName: c.name,
            colorCode: c.code,
            images: c.images?.map((img: any) => img.url) || [],
            sizes: c.variants?.map((v: any) => ({
                id: v.id,
                size: v.size,
                price: v.price?.toString() || "",
                stock: v.stock?.toString() || "",
                sku: v.sku || ""
            })) || []
        })) || [],
        // Ensure discount is properly structured if valid
        discount: data.discount || { type: "percentage", value: 0 }
    };
};

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const { showSuccess, showLoading, showConfirm, showError } = useDialog();

    // Data States
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeLang, setActiveLang] = useState<Lang>('en');

    const [formData, setFormData] = useState(transformInitialData(initialData) || {
        name: "",
        slug: "",
        description: "",
        localizedNames: { bn: "" },
        localizedDescriptions: { bn: "" },
        price: "",
        originalPrice: "",
        categoryName: "",
        sku: "",
        status: "Draft",
        images: [] as { url: string, isPrimary: boolean }[],
        variants: [] as ColorVariant[],
        discount: { type: "percentage", value: 0 },
        badges: [] as string[],
        sizeChart: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    // Auto-calculate Selling Price from Base Price & Discount
    useEffect(() => {
        const basePrice = parseFloat(formData.originalPrice);
        const discountType = formData.discount?.type;
        const discountValue = parseFloat(formData.discount?.value as any);

        if (!isNaN(basePrice)) {
            let sellingPrice = basePrice;

            if (!isNaN(discountValue) && discountValue > 0) {
                if (discountType === 'percentage') {
                    sellingPrice = basePrice - (basePrice * discountValue / 100);
                } else {
                    sellingPrice = basePrice - discountValue;
                }
            }

            // Round to 2 decimal places if needed, or integer
            // Assuming integer for BDT mostly, but currency is decimal.
            // Let's keep decimal precision but maybe round to 2.
            sellingPrice = Math.max(0, parseFloat(sellingPrice.toFixed(2)));

            setFormData((prev: any) => ({
                ...prev,
                price: sellingPrice.toString()
            }));
        }
    }, [formData.originalPrice, formData.discount?.type, formData.discount?.value]);

    // --- Handlers ---

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));

        if (name === "name" && !isEdit && activeLang === 'en') {
            setFormData((prev: any) => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleLocalizedChange = (field: 'name' | 'description', value: string) => {
        if (activeLang === 'en') {
            // Update main fields
            setFormData((prev: any) => ({ ...prev, [field]: value }));
            if (field === 'name' && !isEdit) {
                setFormData((prev: any) => ({
                    ...prev,
                    slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                }));
            }
        } else {
            // Update bn field
            const mapKey = field === 'name' ? 'localizedNames' : 'localizedDescriptions';
            setFormData((prev: any) => ({
                ...prev,
                [mapKey]: { ...prev[mapKey], bn: value }
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

    const handleImageUpload = async (file: File, type: 'product' | 'sizeChart') => {
        try {
            const folder = type === 'sizeChart' ? 'size-charts' : 'products';
            const url = await uploadService.uploadImage(file, folder);

            if (type === 'sizeChart') {
                setFormData((prev: any) => ({ ...prev, sizeChart: url }));
            } else {
                setFormData((prev: any) => ({
                    ...prev,
                    images: [...prev.images, { url, isPrimary: prev.images.length === 0 }]
                }));
            }
        } catch (error) {
            showError("Upload Failed", "Could not upload image. Please try again.");
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, i: number) => i !== index)
        }));
    };

    // --- Submit ---

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        showLoading(isEdit ? "Updating Product" : "Creating Product", "Please wait...");

        try {
            // Transform data for backend if needed
            // Currently backend expects CreateProductDto structure
            // We need to ensure 'categoryName' is populated with ID from selection.
            // And price/originalPrice are numbers

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
                // variants handled by logic in backend service "createFull" function
                // that expects a ColorVariant structure with sizes.
                // It should match what VariantManager produces.
                categoryName: formData.categoryName // This is the ID from select
            };

            // Call actual products API
            console.log("Submit Payload:", payload);

            if (isEdit) {
                if (initialData && initialData.id) {
                    await productsService.update(initialData.id, payload);
                } else {
                    throw new Error("Product ID is missing for update operation.");
                }
            } else {
                await productsService.create(payload);
            }

            showSuccess(isEdit ? "Updated" : "Created", "Product saved successfully.");
            router.push("/products");
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to save product.";
            showError("Error", errorMessage);
        }
    };

    const handleCancel = () => {
        showConfirm("Discard?", "Unsaved changes will be lost.", () => router.back());
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Localization Tabs */}
                    <div className="flex items-center gap-1 bg-gray-800/50 p-1 rounded-lg border border-white/10 w-fit">
                        <button
                            type="button"
                            onClick={() => setActiveLang('en')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeLang === 'en' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <span>English</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveLang('bn')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeLang === 'bn' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Globe size={14} />
                            <span>Bengali</span>
                        </button>
                    </div>

                    {/* Basic Details */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-lg font-bold text-white mb-4">
                            Basic Information ({activeLang === 'en' ? 'English' : 'Bengali'})
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={activeLang === 'en' ? formData.name : formData.localizedNames?.bn || ""}
                                    onChange={(e) => handleLocalizedChange('name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    placeholder={activeLang === 'en' ? "e.g., Premium Silk Hijab" : "e.g., প্রিমিয়াম সিল্ক হিজাব"}
                                    required={activeLang === 'en'}
                                />
                            </div>
                            {activeLang === 'en' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-gray-400 font-mono"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={activeLang === 'en' ? formData.description : formData.localizedDescriptions?.bn || ""}
                                    onChange={(e) => handleLocalizedChange('description', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none h-32"
                                    placeholder="Enter detailed product description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <VariantManager variants={formData.variants} onChange={handleVariantsChange} />
                    </div>

                    {/* Images (Global) */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">Global Images</h3>
                            <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-white transition-all">
                                <Upload size={14} /> Upload
                                <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'product')} />
                            </label>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {formData.images.map((img: any, idx: number) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img.url})` }} />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={12} className="w-3 h-3" /> {/* Assuming X is imported */}
                                    </button>
                                    {img.isPrimary && (
                                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-emerald-500/80 text-[10px] text-white rounded font-bold">MAIN</span>
                                    )}
                                </div>
                            ))}
                            {formData.images.length === 0 && (
                                <div className="col-span-4 border-2 border-dashed border-white/10 rounded-lg p-6 text-center text-gray-500 text-sm">
                                    No global images. Variants can have their own images.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Right Column --- */}
                <div className="space-y-6">

                    {/* Organization */}
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
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    required
                                >
                                    <option value="" className="text-gray-500">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Base Pricing</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Selling Price (Auto-calculated)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    readOnly
                                    className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                                    placeholder="0.00"
                                />
                                <p className="text-xs text-gray-500 mt-1">Calculated from Base Price and Discount.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-emerald-400 mb-1">Base Price / MRP (৳)</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    placeholder="0.00"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter the original price before discount.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Base SKU</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                    placeholder="SKU-001"
                                />
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
                                    <option value="percentage">% Off</option>
                                    <option value="flat">Flat ৳</option>
                                </select>
                                <input
                                    type="number"
                                    value={formData.discount?.value || 0}
                                    onChange={(e) => handleDiscountChange("value", parseFloat(e.target.value))}
                                    className="flex-1 px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
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

                    {/* Size Chart */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Size Chart</h3>
                        {formData.sizeChart ? (
                            <div className="relative group rounded-lg overflow-hidden border border-white/10">
                                <img src={formData.sizeChart} alt="Size Chart" className="w-full h-auto" />
                                <button
                                    type="button"
                                    onClick={() => setFormData((prev: any) => ({ ...prev, sizeChart: "" }))}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                                <FileText className="text-gray-400 group-hover:text-emerald-400 mb-2" size={24} />
                                <span className="text-sm text-gray-400">Upload Size Guide</span>
                                <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'sizeChart')} />
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/10">
                <button type="button" onClick={handleCancel} className="px-6 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm">Cancel</button>
                <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm shadow-lg shadow-emerald-900/20">
                    <Save size={18} /> {isEdit ? "Update Product" : "Create Product"}
                </button>
            </div>
        </form>
    );
}


