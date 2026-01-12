"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    ExternalLink,
    Image as ImageIcon,
    RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/components/Dialog";
import BannerModal from "@/components/banners/BannerModal";
import { bannersService, Banner, CreateBannerDto, UpdateBannerDto } from "@/services/banners.service";

export default function BannersPage() {
    const { user: currentUser } = useAuth();
    const { showConfirm, showSuccess, showError } = useDialog();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await bannersService.getAll();
            setBanners(data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
            showError("Error", "Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = (id: string) => {
        showConfirm(
            "Delete Banner",
            "Are you sure you want to delete this banner? This action cannot be undone.",
            async () => {
                try {
                    await bannersService.delete(id);
                    setBanners(banners.filter(b => b.id !== id));
                    showSuccess("Banner Deleted", "The banner has been deleted successfully.");
                } catch (error: any) {
                    showError("Error", error.message || "Failed to delete banner");
                }
            }
        );
    };

    const handleSave = async (data: CreateBannerDto | UpdateBannerDto) => {
        try {
            if (editingBanner) {
                const updated = await bannersService.update(editingBanner.id, data);
                // Refresh list to keep sorting correct or manually update
                setBanners(banners.map(b => b.id === updated.id ? updated : b));
                showSuccess("Banner Updated", "Banner updated successfully");
            } else {
                const created = await bannersService.create(data as CreateBannerDto);
                setBanners([...banners, created]);
                showSuccess("Banner Created", "Banner created successfully");
            }
            setIsModalOpen(false);
            setEditingBanner(null);
        } catch (error: any) {
            showError("Error", error.message || "Failed to save banner");
        }
    };

    const toggleStatus = (banner: Banner) => {
        const newStatus = !banner.isActive;
        // Optimistic update
        setBanners(banners.map(b => b.id === banner.id ? { ...b, isActive: newStatus } : b));

        bannersService.update(banner.id, { isActive: newStatus })
            .catch((error: any) => {
                // Revert on failure
                setBanners(banners.map(b => b.id === banner.id ? { ...b, isActive: !newStatus } : b));
                showError("Error", "Failed to update status");
            });
    };

    const filteredBanners = banners.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-playfair">Banners</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage homepage banners and sliders
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchBanners()}
                        className="p-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm shadow-lg shadow-emerald-900/20"
                    >
                        <Plus size={18} />
                        Add Banner
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search banners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                {loading && banners.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/20 border-b border-white/10">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Image</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Link</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort Order</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredBanners.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No banners found.</td>
                                    </tr>
                                ) : (
                                    filteredBanners.map(banner => (
                                        <tr key={banner.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-14 bg-gray-800 rounded-lg border border-white/10 overflow-hidden relative group">
                                                    {banner.imageUrl ? (
                                                        <img
                                                            src={banner.imageUrl}
                                                            alt={banner.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { (e.target as any).src = '' }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white text-sm">{banner.title}</p>
                                                    {banner.description && (
                                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{banner.description}</p>
                                                    )}
                                                    {(banner.startDate || banner.endDate) && (
                                                        <p className="text-[10px] text-gray-600 mt-1">
                                                            {banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'Any'} - {banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Any'}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {banner.link ? (
                                                    <a href={banner.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                                                        View Link <ExternalLink size={10} />
                                                    </a>
                                                ) : <span className="text-xs text-gray-600">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded">
                                                    {banner.sortOrder}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(banner)}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${banner.isActive
                                                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                        }`}
                                                >
                                                    {banner.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                    {banner.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingBanner(banner); setIsModalOpen(true); }}
                                                        className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(banner.id)}
                                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <BannerModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingBanner(null); }}
                onSave={handleSave}
                banner={editingBanner}
            />
        </div>
    );
}
