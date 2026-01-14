"use client";

import { useState, useEffect } from 'react';
import styles from './ProductDetails.module.css';

interface ProductGalleryProps {
    images: string[];
    title: string;
    selectedColor: string | null;
}

import Image from 'next/image';

export default function ProductGallery({ images, title, selectedColor }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    // Sync state when images prop changes (crucial for variant switching)
    useEffect(() => {
        if (images && images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <div className={styles.galleryContainer}>
            <div className={styles.thumbnails}>
                {images.map((img, index) => (
                    <button
                        key={index}
                        className={`${styles.thumbnailButton} ${selectedImage === img ? styles.activeThumbnail : ''}`}
                        onClick={() => setSelectedImage(img)}
                        aria-label={`View image ${index + 1} of ${title}`}
                    >
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={img}
                                alt={`${title} view ${index + 1}`}
                                className={styles.thumbnailImage}
                                fill
                                sizes="80px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </button>
                ))}
            </div>

            <div className={styles.mainImageWrapper}>
                <Image
                    src={selectedImage}
                    alt={title}
                    className={styles.mainImage}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>
        </div>
    );
}
