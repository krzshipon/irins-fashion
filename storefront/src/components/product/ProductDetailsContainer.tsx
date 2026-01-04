"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/services/api/types';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import styles from './ProductDetails.module.css';

interface ProductDetailsContainerProps {
    product: Product;
    initialGalleryImages: string[];
}

export default function ProductDetailsContainer({ product, initialGalleryImages }: ProductDetailsContainerProps) {
    const searchParams = useSearchParams();
    const colorParam = searchParams?.get('color');
    const sizeParam = searchParams?.get('size');

    // Lifted state from ProductInfo
    const [selectedColor, setSelectedColor] = useState<string | null>(() => {
        // Robust Variant Check for URL param
        if (product.variants && product.variants.length > 0) {
            const paramMatch = product.variants.find(v => v.colorName === colorParam);
            if (paramMatch) return paramMatch.colorName;
            return product.variants[0].colorName; // Default to first variant
        }
        return null;
    });

    // Update state if URL changes
    useEffect(() => {
        if (colorParam && product.variants?.some(v => v.colorName === colorParam)) {
            setSelectedColor(colorParam);
        }
    }, [colorParam, product.variants]);

    // Determine active gallery images
    const currentGalleryImages = (() => {
        if (selectedColor && product.variants) {
            const variant = product.variants.find(v => v.colorName === selectedColor);
            if (variant && variant.images && variant.images.length > 0) {
                return variant.images;
            }
        }
        return initialGalleryImages;
    })();

    return (
        <section className={styles.productContainer}>
            <ProductGallery
                images={currentGalleryImages}
                title={product.name}
                selectedColor={selectedColor}
            />

            <div className={styles.detailsContent}>
                <ProductInfo
                    product={product}
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                    initialSize={sizeParam}
                />

                {/* Mobile-only Related Products placement could go here */}
            </div>
        </section>
    );
}
