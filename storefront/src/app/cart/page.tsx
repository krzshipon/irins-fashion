"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './cart.module.css';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const { dictionary: t } = useLocalization();

    // Use effectivePrice if available, fallback to price for backward compatibility
    const getItemPrice = (item: typeof cartItems[0]) => item.effectivePrice ?? item.price;
    const totalPrice = cartItems.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.cart.title}</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <h2 className={styles.emptyTitle}>{t.cart.emptyTitle}</h2>
                    <p>{t.cart.emptyMessage}</p>
                    <Link href="/" className={styles.continueShoppingBtn}>
                        {t.cart.continueShopping}
                    </Link>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.cartList}>
                        {cartItems.map((item) => (
                            <div key={item.cartItemId} className={styles.cartItem}>
                                <div className={styles.itemImageContainer}>
                                    {(() => {
                                        let displayImage = null;

                                        // Try to find color-specific image
                                        if (item.selectedColor && item.colors) {
                                            const colorData = item.colors.find(c => c.name === item.selectedColor);
                                            if (colorData && colorData.images && colorData.images.length > 0) {
                                                displayImage = colorData.images[0].url;
                                            }
                                        }

                                        // Fallback to primary product image
                                        if (!displayImage && item.images && item.images.length > 0) {
                                            displayImage = item.images.find(img => img.isPrimary)?.url || item.images[0].url;
                                        }

                                        return displayImage ? (
                                            <Image
                                                src={displayImage}
                                                alt={item.name}
                                                fill
                                                sizes="130px"
                                                className={styles.itemImage}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                        );
                                    })()}
                                </div>

                                <div className={styles.itemDetails}>
                                    <div className={styles.itemHeader}>
                                        <Link
                                            href={{
                                                pathname: `/product/${item.sku}`,
                                                query: {
                                                    color: item.selectedColor,
                                                    size: item.selectedSize
                                                }
                                            }}
                                            className={styles.itemName}
                                        >
                                            {item.name}
                                        </Link>
                                        <div className={styles.itemMeta}>
                                            {(item.selectedColor || item.selectedSize) && (
                                                <div className={styles.itemVariants}>
                                                    {item.selectedColor && <span className={styles.variantOption}>{t.cart.color}: {item.selectedColor}</span>}
                                                    {item.selectedSize && <span className={styles.variantOption}>{t.cart.size}: {item.selectedSize}</span>}
                                                </div>
                                            )}
                                            <div className={styles.quantityControls}>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>
                                                <span className={styles.quantity}>{item.quantity}</span>
                                                <button
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        {/* Show original price crossed out if there's a discount */}
                                        {item.originalPrice && item.originalPrice > getItemPrice(item) && (
                                            <span style={{
                                                textDecoration: 'line-through',
                                                color: '#6b7280',
                                                fontSize: '0.9em',
                                                marginRight: '6px'
                                            }}>
                                                {item.currency} {item.originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                        <span style={{
                                            color: (item.originalPrice && item.originalPrice > getItemPrice(item)) ? '#dc2626' : 'inherit',
                                            fontWeight: (item.originalPrice && item.originalPrice > getItemPrice(item)) ? '500' : 'normal'
                                        }}>
                                            {item.currency} {getItemPrice(item).toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.cartItemId)}
                                    >
                                        {t.common.remove}
                                    </button>
                                </div>

                                <div className={styles.itemTotal}>
                                    {item.currency} {(getItemPrice(item) * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summaryCard}>
                        <h2 className={styles.summaryTitle}>{t.cart.orderSummary}</h2>

                        <div className={styles.summaryRow}>
                            <span>{t.cart.subtotal} ({itemCount} {t.cart.items})</span>
                            <span>{cartItems[0]?.currency || 'BDT'} {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>{t.cart.shipping}</span>
                            <span>{t.cart.calculatedAtCheckout}</span>
                        </div>

                        <div className={styles.summaryTotal}>
                            <span>{t.cart.total}</span>
                            <span>{cartItems[0]?.currency || 'BDT'} {totalPrice.toLocaleString()}</span>
                        </div>

                        <Link href="/checkout" className={styles.checkoutBtn} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                            {t.cart.proceedToCheckout}
                        </Link>

                        <div className={styles.secureText}>
                            🔒 {t.common.secureCheckout}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
