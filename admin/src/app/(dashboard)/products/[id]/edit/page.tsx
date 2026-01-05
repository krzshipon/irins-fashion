"use client";

import { useRouter, useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { useEffect, useState } from "react";
import { productsService } from "@/services/products.service";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await productsService.getOne(id as string);
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch product", error);
            // Optional: show error toast or redirect
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Product not found.</p>
                <button onClick={() => router.back()} className="text-emerald-500 hover:underline mt-2">Go Back</button>
            </div>
        );
    }

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

            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
