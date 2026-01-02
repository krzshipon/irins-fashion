import React from 'react';
import { ShippingDetails } from '@/types/checkout';
import { useLocalization } from '@/context/LocalizationContext';

interface ShippingFormProps {
    value: ShippingDetails;
    onChange: (details: ShippingDetails) => void;
    errors: Partial<Record<keyof ShippingDetails, string>>;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({ value, onChange, errors }) => {
    const { dictionary: t } = useLocalization();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: newValue } = e.target;
        onChange({ ...value, [name as keyof ShippingDetails]: newValue });
    };

    // Premium input style: minimal border, no rounding (or slight), focus accent
    const inputClasses = "w-full py-3 px-0 border-b border-gray-200 text-gray-900 placeholder-transparent focus:outline-none focus:border-black transition-colors bg-transparent peer";
    const labelClasses = "absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-black";
    const errorClasses = "text-red-500 text-xs mt-1";

    const renderInput = (name: keyof ShippingDetails, label: string, type: string = "text", layoutClass: string = "") => (
        <div className={`relative z-0 w-full mb-6 group ${layoutClass}`}>
            <input
                type={type}
                name={name}
                id={name}
                value={value[name] || ''}
                onChange={handleChange}
                className={`${inputClasses} ${errors[name] ? 'border-red-500' : ''}`}
                placeholder=" "
            />
            <label htmlFor={name} className={labelClasses}>
                {label}
            </label>
            {errors[name] && <p className={errorClasses}>{errors[name]}</p>}
        </div>
    );

    return (
        <div className="bg-white p-8 md:p-0"> {/* Removed card styling for cleaner look, padding handles spacing */}
            <h2 className="text-3xl font-serif text-gray-900 mb-8">{t.checkout.shipping}</h2>

            <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {renderInput("firstName", t.checkout.form.firstName)}
                    {renderInput("lastName", t.checkout.form.lastName)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {renderInput("email", t.checkout.form.email, "email")}
                    {renderInput("phone", t.checkout.form.phone, "tel")}
                </div>

                {renderInput("address", t.checkout.form.address)}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {renderInput("city", t.checkout.form.city)}
                    {renderInput("postalCode", t.checkout.form.postalCode)}
                </div>
            </div>
        </div>
    );
};
