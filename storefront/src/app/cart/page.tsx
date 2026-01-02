"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './cart.module.css';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Filter valid items and unique count for summary
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Shopping Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <h2 className={styles.emptyTitle}>Your cart is currently empty.</h2>
                    <p>Looks like you haven't made your choice yet.</p>
                    <Link href="/" className={styles.continueShoppingBtn}>
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.cartList}>
                        {cartItems.map((item, index) => (
                            <div key={item.cartItemId} className={styles.cartItem}>
                                <div className={styles.itemImageContainer}>
                                    {/* Using a placeholder if image is missing, or the item image */}
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className={styles.itemImage}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                    )}
                                </div>

                                <div className={styles.itemDetails}>
                                    <div className={styles.itemHeader}>
                                        <Link href={`/product/${item.id}`} className={styles.itemName}>
                                            {item.name}
                                        </Link>
                                        <div className={styles.itemMeta}>
                                            {(item.selectedColor || item.selectedSize) && (
                                                <div className={styles.itemVariants}>
                                                    {item.selectedColor && <span className={styles.variantOption}>Color: {item.selectedColor}</span>}
                                                    {item.selectedSize && <span className={styles.variantOption}>Size: {item.selectedSize}</span>}
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
                                        {item.currency} {item.price.toLocaleString()}
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.cartItemId)}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className={styles.itemTotal}>
                                    {item.currency} {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summaryCard}>
                        <h2 className={styles.summaryTitle}>Order Summary</h2>

                        <div className={styles.summaryRow}>
                            <span>Subtotal ({itemCount} items)</span>
                            <span>{cartItems[0]?.currency || 'BDT'} {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <div className={styles.summaryTotal}>
                            <span>Total</span>
                            <span>{cartItems[0]?.currency || 'BDT'} {totalPrice.toLocaleString()}</span>
                        </div>

                        <button className={styles.checkoutBtn}>
                            Proceed to Checkout
                        </button>

                        <div className={styles.secureText}>
                            🔒 Secure Checkout
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
