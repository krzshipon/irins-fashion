import React from 'react';
import { ShippingDetails, DeliveryZone, ShippingRates } from '@/types/checkout';
import { useLocalization } from '@/context/LocalizationContext';
import { Division } from '@/services/api/divisions';

interface ShippingFormProps {
    value: ShippingDetails;
    onChange: (details: ShippingDetails) => void;
    errors: Partial<Record<keyof ShippingDetails, string>>;
    shippingRates: ShippingRates;
    divisions: Division[];
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ value, onChange, errors, shippingRates, divisions }) => {
    const { dictionary: t, locale } = useLocalization();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value: newValue } = e.target;
        onChange({ ...value, [name as keyof ShippingDetails]: newValue });
    };

    const handleDeliveryZoneChange = (zone: DeliveryZone) => {
        onChange({ ...value, deliveryZone: zone });
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '15px',
        border: '2px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#111',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };

    const inputErrorStyle: React.CSSProperties = {
        ...inputStyle,
        borderColor: '#ef4444',
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 12px center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '20px',
        paddingRight: '40px',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: '2px solid #e5e5e5',
    };

    return (
        <div>
            {/* Contact Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={sectionTitleStyle}>{t.checkout.contactInfo}</h2>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="phone" style={labelStyle}>{t.checkout.form.mobileNumber}</label>
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
                            name="phone"
                            id="phone"
                            value={value.phone || ''}
                            onChange={handleChange}
                            placeholder="01XXXXXXXXX"
                            maxLength={11}
                            style={{
                                ...(errors.phone ? inputErrorStyle : inputStyle),
                                paddingLeft: '52px',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#111';
                                e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.phone ? '#ef4444' : '#d1d5db';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                    {errors.phone && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
                </div>
            </div>

            {/* Shipping Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={sectionTitleStyle}>{t.checkout.shippingAddress}</h2>

                {/* Full Name and Division - side by side on larger screens */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '20px' }} className="md:!grid-cols-2">
                    <div>
                        <label htmlFor="fullName" style={labelStyle}>{t.checkout.form.fullName}</label>
                        <input
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={value.fullName || ''}
                            onChange={handleChange}
                            style={errors.fullName ? inputErrorStyle : inputStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#111';
                                e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.fullName ? '#ef4444' : '#d1d5db';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {errors.fullName && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.fullName}</p>}
                    </div>

                    {/* Division Dropdown */}
                    <div>
                        <label htmlFor="division" style={labelStyle}>{t.checkout.form.division}</label>
                        <select
                            name="division"
                            id="division"
                            value={value.division || ''}
                            onChange={handleChange}
                            style={errors.division ? { ...selectStyle, borderColor: '#ef4444' } : selectStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#111';
                                e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.division ? '#ef4444' : '#d1d5db';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <option value="">{t.checkout.form.selectDivision}</option>
                            {divisions.map((div) => (
                                <option key={div.id} value={div.id}>
                                    {locale === 'bn' ? div.nameBn : div.name}
                                </option>
                            ))}
                        </select>
                        {errors.division && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.division}</p>}
                    </div>
                </div>

                {/* Full Address */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="address" style={labelStyle}>{t.checkout.form.fullAddress}</label>
                    <textarea
                        name="address"
                        id="address"
                        value={value.address || ''}
                        onChange={handleChange}
                        placeholder={t.checkout.form.fullAddressPlaceholder}
                        rows={2}
                        style={{
                            ...(errors.address ? inputErrorStyle : inputStyle),
                            resize: 'vertical',
                            minHeight: '70px',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#111';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = errors.address ? '#ef4444' : '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    {errors.address && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.address}</p>}
                </div>

                {/* Order Notes */}
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="notes" style={labelStyle}>
                        {t.checkout.form.notes} <span style={{ fontWeight: '400', color: '#9ca3af' }}>({t.common.optional})</span>
                    </label>
                    <textarea
                        name="notes"
                        id="notes"
                        value={value.notes}
                        onChange={handleChange}
                        placeholder={t.checkout.form.notesPlaceholder}
                        rows={3}
                        style={{
                            ...inputStyle,
                            resize: 'vertical',
                            minHeight: '80px',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#111';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Delivery Zone Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={sectionTitleStyle}>{t.checkout.deliveryZone}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Inside Dhaka */}
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            border: `2px solid ${value.deliveryZone === 'inside_dhaka' ? '#111' : '#e5e5e5'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: value.deliveryZone === 'inside_dhaka' ? '#f9fafb' : '#fff',
                            transition: 'all 0.2s',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: `2px solid ${value.deliveryZone === 'inside_dhaka' ? '#111' : '#d1d5db'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {value.deliveryZone === 'inside_dhaka' && (
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#111' }}></div>
                                )}
                            </div>
                            <div>
                                <span style={{ fontWeight: '600', color: '#111' }}>{t.checkout.delivery.insideDhaka}</span>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{t.checkout.delivery.insideDhakaDesc}</p>
                            </div>
                        </div>
                        <span style={{ fontWeight: '700', color: '#111' }}>৳ {shippingRates.insideDhaka}</span>
                        <input
                            type="radio"
                            name="deliveryZone"
                            value="inside_dhaka"
                            checked={value.deliveryZone === 'inside_dhaka'}
                            onChange={() => handleDeliveryZoneChange('inside_dhaka')}
                            style={{ display: 'none' }}
                        />
                    </label>

                    {/* Outside Dhaka */}
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            border: `2px solid ${value.deliveryZone === 'outside_dhaka' ? '#111' : '#e5e5e5'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            backgroundColor: value.deliveryZone === 'outside_dhaka' ? '#f9fafb' : '#fff',
                            transition: 'all 0.2s',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                border: `2px solid ${value.deliveryZone === 'outside_dhaka' ? '#111' : '#d1d5db'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {value.deliveryZone === 'outside_dhaka' && (
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#111' }}></div>
                                )}
                            </div>
                            <div>
                                <span style={{ fontWeight: '600', color: '#111' }}>{t.checkout.delivery.outsideDhaka}</span>
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{t.checkout.delivery.outsideDhakaDesc}</p>
                            </div>
                        </div>
                        <span style={{ fontWeight: '700', color: '#111' }}>৳ {shippingRates.outsideDhaka}</span>
                        <input
                            type="radio"
                            name="deliveryZone"
                            value="outside_dhaka"
                            checked={value.deliveryZone === 'outside_dhaka'}
                            onChange={() => handleDeliveryZoneChange('outside_dhaka')}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
                {errors.deliveryZone && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{errors.deliveryZone}</p>}
            </div>

            {/* Payment Section */}
            <div>
                <h2 style={sectionTitleStyle}>{t.checkout.paymentMethod}</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                    {t.checkout.payment.secureNote}
                </p>
                <div style={{ border: '2px solid #111', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px 20px',
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e5e5',
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '2px solid #111',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#111' }}></div>
                        </div>
                        <span style={{ fontWeight: '600', color: '#111' }}>{t.checkout.payment.cod}</span>
                    </div>
                    <div style={{ padding: '32px', backgroundColor: '#fff', textAlign: 'center' }}>
                        <svg style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                        <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '280px', margin: '0 auto' }}>
                            {t.checkout.payment.codDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};
