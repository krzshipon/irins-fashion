"use client";

import { useState, useEffect } from 'react';
import styles from './ProductDetails.module.css';

interface ProductGalleryProps {
    images: string[];
    title: string;
    selectedColor: string | null;
    colorImages?: Record<string, string>;
}

export default function ProductGallery({ images, title, selectedColor, colorImages }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    // Update selected image when color changes
    useEffect(() => {
        if (selectedColor && colorImages && colorImages[selectedColor]) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedImage(colorImages[selectedColor]);
        }
    }, [selectedColor, colorImages]);

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
                        <img
                            src={img}
                            alt={`${title} view ${index + 1}`}
                            className={styles.thumbnailImage}
                        />
                    </button>
                ))}
            </div>

            <div className={styles.mainImageWrapper}>
                <img
                    src={selectedImage}
                    alt={title}
                    className={styles.mainImage}
                />
            </div>
        </div>
    );
}
