"use client";

import { useCart } from '@/context/CartContext';
import styles from './cart.module.css';

export default function CartPage() {
    const { cartItems } = useCart();

    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <div className={styles.cartList}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <div className={styles.itemInfo}>
                                <h3 className={styles.itemName}>{item.name}</h3>
                                <p className={styles.itemPrice}>{item.price.toLocaleString()} BDT</p>
                            </div>
                            <div className={styles.itemQuantity}>
                                Quantity: {item.quantity}
                            </div>
                            <div className={styles.itemTotal}>
                                {(item.price * item.quantity).toLocaleString()} BDT
                            </div>
                        </div>
                    ))}

                    <div className={styles.summary}>
                        <div className={styles.totalRow}>
                            <span>Total:</span>
                            <span className={styles.totalAmount}>{totalPrice.toLocaleString()} BDT</span>
                        </div>
                        <button className={styles.checkoutBtn}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
