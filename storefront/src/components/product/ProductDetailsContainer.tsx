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
        if (product.colors && product.colors.length > 0) {
            const paramMatch = product.colors.find(c => c.name === colorParam);
            if (paramMatch) return paramMatch.name;
            return product.colors[0].name; // Default to first color
        }
        return null;
    });

    // Update state if URL changes
    useEffect(() => {
        if (colorParam && product.colors?.some(c => c.name === colorParam)) {
            setSelectedColor(colorParam);
        }
    }, [colorParam, product.colors]);

    // Determine active gallery images
    const currentGalleryImages = (() => {
        if (selectedColor && product.colors) {
            const color = product.colors.find(c => c.name === selectedColor);
            if (color && color.images && color.images.length > 0) {
                return color.images.map(img => img.url);
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
