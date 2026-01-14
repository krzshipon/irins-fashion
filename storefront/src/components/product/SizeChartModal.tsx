"use client";

import React from 'react';

interface SizeChartModalProps {
    imageUrl: string;
    onClose: () => void;
}

export default function SizeChartModal({ imageUrl, onClose }: SizeChartModalProps) {
    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#fff', padding: '20px', borderRadius: '8px',
                    maxWidth: '90%', maxHeight: '90%', overflow: 'auto', position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '10px', right: '10px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}
                    aria-label="Close"
                >
                    ✕
                </button>
                <h3 style={{ marginBottom: '15px' }}>Size Guide</h3>
                <img src={imageUrl} alt="Size Chart" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
        </div>
    );
}
