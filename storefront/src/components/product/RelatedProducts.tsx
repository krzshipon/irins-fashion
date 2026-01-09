"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/services/api/types';
import { getProductsBySlug } from '@/services/api/products';
import ProductCard from '@/components/common/ProductCard';

interface RelatedProductsProps {
    category: string;
    currentProductId: string;
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchRelated = async () => {
            // category prop is now passed as slug from page.tsx
            const { products: items } = await getProductsBySlug(category);
            // Filter out current product
            setProducts(items.filter(p => p.id !== currentProductId).slice(0, 4));
        };
        fetchRelated();
    }, [category, currentProductId]);

    if (products.length === 0) return null;

    return (
        <section style={{ marginTop: '5rem', marginBottom: '3rem' }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '2rem',
                fontFamily: 'var(--font-outfit)',
                textAlign: 'left'
            }}>
                You May Also Like
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
