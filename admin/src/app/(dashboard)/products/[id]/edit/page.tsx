"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";

const MOCK_PRODUCT_DATA = {
    name: "Premium Silk Hijab - Midnight Blue",
    slug: "premium-silk-hijab-midnight-blue",
    description: "Experience the luxury of our Premium Silk Hijab. Crafted from 100% pure silk, this hijab offers a smooth, lightweight feel and a subtle sheen.",
    price: "1250",
    salePrice: "1050",
    category: "Hijab",
    sku: "SKU-HJB-001",
    stock: "45",
    status: "Published",
    images: [],
    attributes: [
        { name: "Material", value: "100% Silk" },
        { name: "Size", value: "180cm x 70cm" },
        { name: "Color", value: "Midnight Blue" },
    ]
};

export default function EditProductPage() {
    const router = useRouter();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white font-playfair">Edit Product</h1>
                    <p className="text-gray-400 text-sm mt-1">Update product details and inventory</p>
                </div>
            </div>

            <ProductForm initialData={MOCK_PRODUCT_DATA} isEdit={true} />
        </div>
    );
}
