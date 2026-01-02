"use client";

import { useState } from 'react';
import { Product } from '@/services/api/types';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import styles from './ProductDetails.module.css';

interface ProductDetailsContainerProps {
    product: Product;
    initialGalleryImages: string[];
}

export default function ProductDetailsContainer({ product, initialGalleryImages }: ProductDetailsContainerProps) {
    // Lifted state from ProductInfo
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.colors ? product.colors[0] : null
    );

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
                />

                {/* Mobile-only Related Products placement could go here */}
            </div>
        </section>
    );
}
