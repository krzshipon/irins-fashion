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
    const colorParam = searchParams.get('color');
    const sizeParam = searchParams.get('size');

    // Lifted state from ProductInfo
    const [selectedColor, setSelectedColor] = useState<string | null>(() => {
        if (colorParam && product.colors?.includes(colorParam)) {
            return colorParam;
        }
        return product.colors ? product.colors[0] : null;
    });

    // Update state if URL changes (e.g. navigation between variants)
    useEffect(() => {
        if (colorParam && product.colors?.includes(colorParam)) {
            setSelectedColor(colorParam);
        }
    }, [colorParam, product.colors]);

    return (
        <section className={styles.productContainer}>
            <ProductGallery
                images={initialGalleryImages}
                title={product.name}
                selectedColor={selectedColor}
                colorImages={product.colorImages}
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
