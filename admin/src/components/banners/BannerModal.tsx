"use client";

import { useState, useEffect } from "react";
import { X, Save, Calendar, Hash, Globe, Settings, Image as ImageIcon } from "lucide-react";
import { CreateBannerDto, UpdateBannerDto } from "@/services/banners.service";
import ImageUpload from "../common/ImageUpload";
import LinkSelector, { LinkSelectorValue } from "../common/LinkSelector";

interface BannerModalProps {
    banner?: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateBannerDto | UpdateBannerDto) => void;
}

export default function BannerModal({ banner, isOpen, onClose, onSave }: BannerModalProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'en' | 'bn'>('general');
    const [formData, setFormData] = useState<CreateBannerDto>({
        title: "",
        titleBn: "",
        subtitle: "",
        subtitleBn: "",
        description: "",
        buttonText: "Shop Now",
        buttonTextBn: "এখনই কিনুন",
        imageUrl: "",
        linkType: "EXTERNAL",
        linkId: "",
        link: "",
        isActive: true,
        sortOrder: 0,
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        if (banner) {
            setFormData({
                title: banner.title || "",
                titleBn: banner.titleBn || "",
                subtitle: banner.subtitle || "",
                subtitleBn: banner.subtitleBn || "",
                description: banner.description || "",
                buttonText: banner.buttonText || "Shop Now",
                buttonTextBn: banner.buttonTextBn || "এখনই কিনুন",
                imageUrl: banner.imageUrl || "",
                linkType: banner.linkType || "EXTERNAL",
                linkId: banner.linkId || "",
                link: banner.link || "",
                isActive: banner.isActive,
                sortOrder: banner.sortOrder || 0,
                startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : "",
                endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : "",
            });
        } else {
            setFormData({
                title: "",
                titleBn: "",
                subtitle: "",
                subtitleBn: "",
                description: "",
                buttonText: "Shop Now",
                buttonTextBn: "এখনই কিনুন",
                imageUrl: "",
                linkType: "EXTERNAL",
                linkId: "",
                link: "",
                isActive: true,
                sortOrder: 0,
                startDate: "",
                endDate: ""
            });
        }
    }, [banner, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submissionData = {
            ...formData,
            sortOrder: Number(formData.sortOrder),
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
            endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        };

        if (!submissionData.startDate) delete (submissionData as any).startDate;
        if (!submissionData.endDate) delete (submissionData as any).endDate;

        // Ensure linkType is valid
        if (!['EXTERNAL', 'PRODUCT', 'CATEGORY'].includes(submissionData.linkType || '')) {
            submissionData.linkType = 'EXTERNAL';
        }

        onSave(submissionData as any);
    };

    const tabs = [
        { id: 'general', label: 'General & Design', icon: Settings },
        { id: 'en', label: 'English Content', icon: Globe },
        { id: 'bn', label: 'Bengali Content', icon: Globe },
    ] as const;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{banner ? "Edit Banner" : "New Banner"}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-white/10 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-emerald-500 text-emerald-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    <form id="banner-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* General Tab */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                    folder="banners"
                                    label="Banner Image *"
                                />

                                <LinkSelector
                                    value={{
                                        linkType: formData.linkType as LinkSelectorValue['linkType'],
                                        linkId: formData.linkId,
                                        link: formData.link
                                    }}
                                    onChange={(val) => setFormData({
                                        ...formData,
                                        linkType: val.linkType,
                                        linkId: val.linkId,
                                        link: val.link
                                    })}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Sort Order</label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="number"
                                                value={formData.sortOrder}
                                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center h-full pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer group select-none">
                                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-4' : ''}`} />
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.isActive || false}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                                Active Status
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="datetime-local"
                                                value={formData.startDate || ""}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="datetime-local"
                                                value={formData.endDate || ""}
                                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* English Tab */}
                        {activeTab === 'en' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title (English) *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                        required={activeTab === 'en'} // Only require if checking validation per tab? No, keep required always if main.
                                        placeholder="e.g. Summer Collection"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle (English)</label>
                                    <textarea
                                        value={formData.subtitle || ""}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 min-h-[80px]"
                                        placeholder="Brief description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Button Text (English)</label>
                                    <input
                                        type="text"
                                        value={formData.buttonText || ""}
                                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="e.g. Shop Now"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bengali Tab */}
                        {activeTab === 'bn' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title (Bengali)</label>
                                    <input
                                        type="text"
                                        value={formData.titleBn || ""}
                                        onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="উদাহরণ: গ্রীষ্মকালীন কালেকশন"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Subtitle (Bengali)</label>
                                    <textarea
                                        value={formData.subtitleBn || ""}
                                        onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50 min-h-[80px]"
                                        placeholder="সংক্ষিপ্ত বিবরণ..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Button Text (Bengali)</label>
                                    <input
                                        type="text"
                                        value={formData.buttonTextBn || ""}
                                        onChange={(e) => setFormData({ ...formData, buttonTextBn: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="উদাহরণ: এখনই কিনুন"
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex items-center justify-end gap-3 bg-gray-800 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="banner-form"
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm shadow-lg shadow-emerald-500/20"
                    >
                        <Save size={16} />
                        Save Banner
                    </button>
                </div>
            </div>
        </div>
    );
}
