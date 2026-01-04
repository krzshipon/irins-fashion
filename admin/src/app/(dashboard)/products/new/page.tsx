"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
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
                    <h1 className="text-xl font-bold text-white font-playfair">Add New Product</h1>
                    <p className="text-gray-400 text-sm mt-1">Create a new product for your store</p>
                </div>
            </div>

            <ProductForm />
        </div>
    );
}
