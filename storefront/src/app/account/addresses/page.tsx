"use client";

import { useEffect, useState } from "react";
import { Plus, X, Check, Trash2, Pencil, ChevronDown, User, MapPin, Phone } from "lucide-react";
import Skeleton from "@/components/common/Skeleton";
import { authService } from "@/services/api/auth.service";
import { addressesService } from "@/services/api/addresses.service";
import type { Address } from "@/services/api/types";
import styles from "../pages.module.css";
import addressStyles from "./addresses.module.css";

// Address Form Interfaces
interface AddressFormData {
    label: string;
    recipientName: string;
    address: string;
    division: string;
    phone: string;
    isDefault: boolean;
}

const INITIAL_FORM_DATA: AddressFormData = {
    label: "Home",
    recipientName: "",
    address: "",
    division: "Dhaka",
    phone: "",
    isDefault: false,
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<AddressFormData>(INITIAL_FORM_DATA);
    const [saving, setSaving] = useState(false);

    const loadAddresses = async () => {
        try {
            const data = await addressesService.getAll();
            setAddresses(data);
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleOpenModal = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                label: address.label,
                recipientName: address.recipientName,
                address: address.address,
                division: address.division,
                phone: address.phone,
                isDefault: address.isDefault,
            });
        } else {
            setEditingAddress(null);
            setFormData(INITIAL_FORM_DATA);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
        setFormData(INITIAL_FORM_DATA);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // For now, adding a dummy postal code to satisfy the API type if needed
            // Or ideally, update the API type to make postalCode optional.
            // But since I cannot change types easily right now without checking types.ts
            // I will just pass an empty string or 'N/A' as the API might expect it.
            const addressData = {
                ...formData,
            };

            if (editingAddress) {
                await addressesService.update(editingAddress.id, addressData);
            } else {
                await addressesService.create(addressData);
            }
            await loadAddresses();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save address", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this address?")) {
            try {
                await addressesService.delete(id);
                await loadAddresses();
            } catch (error) {
                console.error("Failed to delete address", error);
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <Skeleton width={180} height={32} style={{ marginBottom: '24px' }} />
                <div className={addressStyles.grid}>
                    {[1, 2].map(i => (
                        <div key={i} className={addressStyles.addressCard}>
                            <div className={addressStyles.cardHeader}>
                                <Skeleton width={100} height={20} />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Skeleton width={24} height={24} />
                                    <Skeleton width={24} height={24} />
                                </div>
                            </div>
                            <div className={addressStyles.cardContent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Skeleton width="60%" height={16} />
                                <Skeleton width="90%" height={32} />
                                <Skeleton width="40%" height={16} />
                            </div>
                        </div>
                    ))}
                    <div className={addressStyles.addCard} style={{ border: '1px dashed #e5e5e5' }}>
                        <Skeleton width={32} height={32} borderRadius="50%" style={{ marginBottom: '8px' }} />
                        <Skeleton width={120} height={20} />
                    </div>
                </div>
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
                        <div className={addressStyles.cardHeader}>
                            <h3 className={addressStyles.addressLabel}>{address.label}</h3>
                            <div className={addressStyles.cardActions}>
                                <button
                                    className={addressStyles.iconBtn}
                                    onClick={() => handleOpenModal(address)}
                                    title="Edit Address"
                                >
                                    <Pencil size={16} />
                                </button>
                                {!address.isDefault && (
                                    <button
                                        className={addressStyles.iconBtn}
                                        onClick={() => handleDelete(address.id)}
                                        title="Delete Address"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={addressStyles.cardContent}>
                            <div className={addressStyles.infoRow}>
                                <div className={addressStyles.iconWrapper}><User size={16} /></div>
                                <p className={addressStyles.infoText}>{address.recipientName}</p>
                            </div>
                            <div className={addressStyles.infoRow}>
                                <div className={addressStyles.iconWrapper}><MapPin size={16} /></div>
                                <div>
                                    <p className={addressStyles.infoText}>{address.address}</p>
                                    <p className={addressStyles.subText}>{address.division}</p>
                                </div>
                            </div>
                            <div className={addressStyles.infoRow}>
                                <div className={addressStyles.iconWrapper}><Phone size={16} /></div>
                                <p className={addressStyles.infoText}>{address.phone}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Address Card */}
                <button className={addressStyles.addCard} onClick={() => handleOpenModal()}>
                    <div className={addressStyles.addIconCircle}>
                        <Plus size={32} />
                    </div>
                    <span>Add New Address</span>
                </button>
            </div>

            {/* Address Modal */}
            {isModalOpen && (
                <div className={addressStyles.modalOverlay} onClick={(e) => {
                    if (e.target === e.currentTarget) handleCloseModal();
                }}>
                    <div className={addressStyles.modal}>
                        <div className={addressStyles.modalHeader}>
                            <h2 className={addressStyles.modalTitle}>
                                {editingAddress ? "Edit Address" : "Add New Address"}
                            </h2>
                            <button className={addressStyles.closeBtn} onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className={addressStyles.modalContent}>
                                {/* Label - Specific to Address Book */}
                                <div className={addressStyles.formGroup}>
                                    <label className={addressStyles.label}>Address Label (e.g. Home, Office)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            className={addressStyles.input}
                                            value={formData.label}
                                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                            placeholder="Home"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone - Matched with Checkout */}
                                <div className={addressStyles.formGroup}>
                                    <label className={addressStyles.label}>Mobile Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#6b7280',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                        }}>+88</span>
                                        <input
                                            type="tel"
                                            className={addressStyles.input}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="01XXXXXXXXX"
                                            style={{ paddingLeft: '52px' }}
                                            required
                                            maxLength={11}
                                        />
                                    </div>
                                </div>

                                {/* Full Name - Matched with Checkout */}
                                <div className={addressStyles.formGroup}>
                                    <label className={addressStyles.label}>Full Name</label>
                                    <input
                                        type="text"
                                        className={addressStyles.input}
                                        value={formData.recipientName}
                                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Address - MOVED BEFORE DIVISION */}
                                <div className={addressStyles.formGroup}>
                                    <label className={addressStyles.label}>Full Address</label>
                                    <textarea
                                        className={addressStyles.textarea}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="House, Road, Area, etc."
                                        rows={2}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            fontSize: '15px',
                                            border: '1px solid #e5e5e5',
                                            borderRadius: '8px',
                                            outline: 'none',
                                            minHeight: '80px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                {/* Division - MOVED AFTER ADDRESS */}
                                <div className={addressStyles.formGroup}>
                                    <label className={addressStyles.label}>Division</label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            className={addressStyles.select}
                                            value={formData.division}
                                            onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Division</option>
                                            <option value="Dhaka">Dhaka</option>
                                            <option value="Chattogram">Chattogram</option>
                                            <option value="Rajshahi">Rajshahi</option>
                                            <option value="Khulna">Khulna</option>
                                            <option value="Barishal">Barishal</option>
                                            <option value="Sylhet">Sylhet</option>
                                            <option value="Rangpur">Rangpur</option>
                                            <option value="Mymensingh">Mymensingh</option>
                                        </select>
                                        <ChevronDown size={16} className={addressStyles.selectIcon} />
                                    </div>
                                </div>

                                <div className={addressStyles.checkboxGroup}>
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    />
                                    <label htmlFor="isDefault">Set as default delivery address</label>
                                </div>
                            </div>

                            <div className={addressStyles.modalFooter}>
                                <div className={addressStyles.modalActions}>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className={addressStyles.cancelBtn}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={addressStyles.saveBtn}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
