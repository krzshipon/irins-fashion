"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, GripVertical, Eye, Image as ImageIcon } from "lucide-react";

// Mock data - will be replaced with API calls
const MOCK_BANNERS = [
    {
        id: "hero-hijab",
        title: "Premium Hijab Collection",
        titleBn: "প্রিমিয়াম হিজাব কালেকশন",
        subtitle: "Elegant styles for every occasion - silk, chiffon & jersey",
        subtitleBn: "প্রতিটি উপলক্ষের জন্য মার্জিত স্টাইল - সিল্ক, শিফন ও জার্সি",
        image: "/images/hero-banner.png",
        link: "/collection/hijabs",
        category: "Hijab",
        isActive: true,
    },
    {
        id: "hero-abaya",
        title: "Timeless Abaya Designs",
        titleBn: "কালজয়ী আবায়া ডিজাইন",
        subtitle: "From classic black to contemporary embroidered pieces",
        subtitleBn: "ক্লাসিক কালো থেকে আধুনিক এমব্রয়ডারি পিস",
        image: "/images/hero-banner-urban.png",
        link: "/collection/abayas",
        category: "Abaya",
        isActive: true,
    },
    {
        id: "hero-accessories",
        title: "Complete Your Look",
        titleBn: "আপনার লুক সম্পূর্ণ করুন",
        subtitle: "Handbags, jewelry & accessories to match your style",
        subtitleBn: "হ্যান্ডব্যাগ, জুয়েলারি ও এক্সেসরিজ আপনার স্টাইলের সাথে",
        image: "/images/hero-banner-cozy.png",
        link: "/collection/accessories",
        category: "Accessories",
        isActive: false,
    },
];

type Banner = typeof MOCK_BANNERS[0];

export default function BannersPage() {
    const [banners, setBanners] = useState(MOCK_BANNERS);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        titleBn: "",
        subtitle: "",
        subtitleBn: "",
        image: "",
        link: "",
        category: "",
    });

    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            titleBn: banner.titleBn,
            subtitle: banner.subtitle,
            subtitleBn: banner.subtitleBn,
            image: banner.image,
            link: banner.link,
            category: banner.category,
        });
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingBanner(null);
        setFormData({
            title: "",
            titleBn: "",
            subtitle: "",
            subtitleBn: "",
            image: "",
            link: "",
            category: "",
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingBanner) {
            setBanners(banners.map(b =>
                b.id === editingBanner.id
                    ? { ...b, ...formData }
                    : b
            ));
        } else {
            setBanners([...banners, {
                id: `banner-${Date.now()}`,
                ...formData,
                isActive: true,
            }]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this banner?")) {
            setBanners(banners.filter(b => b.id !== id));
        }
    };

    const toggleActive = (id: string) => {
        setBanners(banners.map(b =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
        ));
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-playfair">Banners</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage hero carousel and promotional banners
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                    <Plus size={18} />
                    Add Banner
                </button>
            </div>

            {/* Preview Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <Eye className="text-blue-600 shrink-0" size={20} />
                <p className="text-sm text-blue-700">
                    Active banners will appear in the hero carousel on the storefront homepage.
                    Drag to reorder the display sequence.
                </p>
            </div>

            {/* Banners List */}
            <div className="space-y-4">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`bg-white rounded-xl border ${banner.isActive ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'} overflow-hidden hover:shadow-lg transition-all group`}
                    >
                        <div className="flex items-stretch">
                            {/* Drag Handle */}
                            <div className="flex items-center justify-center px-4 bg-gray-50 border-r border-gray-100 cursor-grab">
                                <GripVertical className="text-gray-300" size={20} />
                            </div>

                            {/* Image Preview */}
                            <div className="w-48 h-32 bg-gray-100 shrink-0 flex items-center justify-center">
                                <ImageIcon className="text-gray-300" size={40} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 truncate">{banner.title}</h3>
                                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${banner.isActive
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {banner.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate mb-2">{banner.subtitle}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <ExternalLink size={12} />
                                                {banner.link}
                                            </span>
                                            {banner.category && (
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">{banner.category}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => toggleActive(banner.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${banner.isActive
                                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                }`}
                                        >
                                            {banner.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editingBanner ? "Edit Banner" : "Add Banner"}
                        </h2>

                        <div className="grid grid-cols-2 gap-6">
                            {/* English Content */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700 text-sm">English Content</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        placeholder="Banner title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <textarea
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-none"
                                        rows={2}
                                        placeholder="Banner subtitle"
                                    />
                                </div>
                            </div>

                            {/* Bengali Content */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-700 text-sm">Bengali Content (বাংলা)</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.titleBn}
                                        onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        placeholder="ব্যানার শিরোনাম"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <textarea
                                        value={formData.subtitleBn}
                                        onChange={(e) => setFormData({ ...formData, subtitleBn: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-none"
                                        rows={2}
                                        placeholder="ব্যানার সাবটাইটেল"
                                    />
                                </div>
                            </div>

                            {/* Full width fields */}
                            <div className="col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        placeholder="/images/banner.png"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                        <input
                                            type="text"
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                            placeholder="/collection/hijabs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                                        >
                                            <option value="">None</option>
                                            <option value="Hijab">Hijab</option>
                                            <option value="Abaya">Abaya</option>
                                            <option value="Borkha">Borkha</option>
                                            <option value="Gown">Gown</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                            >
                                {editingBanner ? "Save Changes" : "Add Banner"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
