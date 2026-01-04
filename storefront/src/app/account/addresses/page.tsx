"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { authService } from "@/services/api/auth.service";
import type { Address } from "@/services/api/types";
import styles from "../pages.module.css";
import addressStyles from "./addresses.module.css";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const data = await authService.getAddresses();
                setAddresses(data);
            } catch (error) {
                console.error("Failed to load addresses", error);
            } finally {
                setLoading(false);
            }
        };

        loadAddresses();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 className={styles.loadingIcon} size={32} />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>Address Book</h1>

            <div className={addressStyles.grid}>
                {addresses.map((address) => (
                    <div key={address.id} className={addressStyles.addressCard}>
                        {address.isDefault && (
                            <span className={addressStyles.defaultBadge}>Default</span>
                        )}
                        <h3 className={addressStyles.addressLabel}>{address.label}</h3>
                        <p className={addressStyles.addressName}>{address.recipientName}</p>
                        <p className={addressStyles.addressText}>{address.street}</p>
                        <p className={addressStyles.addressText}>
                            {address.city}, {address.division} - {address.postalCode}
                        </p>
                        <p className={addressStyles.addressPhone}>{address.phone}</p>

                        <div className={addressStyles.addressActions}>
                            <button className={addressStyles.editBtn}>Edit</button>
                            {!address.isDefault && (
                                <button className={addressStyles.removeBtn}>Remove</button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <button className={addressStyles.addCard}>
                    <Plus size={24} />
                    <span>Add New Address</span>
                </button>
            </div>
        </div>
    );
}
