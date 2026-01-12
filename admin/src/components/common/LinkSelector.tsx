"use client";

import { useState, useEffect } from "react";
import { Search, Link as LinkIcon, Box, Package as PackageIcon, ExternalLink } from "lucide-react";
import { productsService } from "@/services/products.service";
import { categoriesService } from "@/services/categories.service";

// Define strict types for value to ensure type safety in parent
export interface LinkSelectorValue {
    linkType: 'EXTERNAL' | 'PRODUCT' | 'CATEGORY';
    linkId?: string;
    link?: string;
}

interface LinkSelectorProps {
    value: LinkSelectorValue;
    onChange: (value: LinkSelectorValue) => void;
}

export default function LinkSelector({ value, onChange }: LinkSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (value.linkType === 'CATEGORY') {
            loadCategories();
        }
    }, [value.linkType]);

    useEffect(() => {
        if (value.linkType === 'PRODUCT' && searchQuery.length > 2) {
            const timer = setTimeout(() => searchProducts(searchQuery), 500);
            return () => clearTimeout(timer);
        }
    }, [searchQuery, value.linkType]);

    const loadCategories = async () => {
        try {
            const data = await categoriesService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const searchProducts = async (query: string) => {
        setLoading(true);
        try {
            const response = await productsService.getAll({ search: query, limit: 5 });
            setSearchResults(response.products || []);
        } catch (error) {
            console.error('Failed to search products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (type: LinkSelectorValue['linkType']) => {
        onChange({ ...value, linkType: type, linkId: undefined, link: "" });
        setSearchQuery("");
        setSearchResults([]);
    };

    return (
        <div className="space-y-3 p-4 bg-black/20 rounded-xl border border-white/5">
            <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <LinkIcon size={16} /> Link Destination
            </h3>

            <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg w-fit">
                {(['EXTERNAL', 'PRODUCT', 'CATEGORY'] as const).map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeChange(type)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${value.linkType === type
                            ? 'bg-emerald-600/20 text-emerald-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {value.linkType === 'EXTERNAL' && (
                <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        value={value.link || ""}
                        onChange={(e) => onChange({ ...value, link: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                        placeholder="https://example.com/promo"
                    />
                </div>
            )}

            {value.linkType === 'PRODUCT' && (
                <div className="space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                            placeholder="Search product name..."
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="animate-spin h-4 w-4 border-b-2 border-emerald-500 rounded-full"></div>
                            </div>
                        )}
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="bg-gray-800 border border-white/10 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                            {searchResults.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => {
                                        const generatedLink = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;
                                        onChange({ ...value, linkId: product.id, link: generatedLink });
                                        setSearchQuery(product.name);
                                        setSearchResults([]);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-3 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gray-700 rounded overflow-hidden shrink-0">
                                        {product.images?.[0]?.url && <img src={product.images[0].url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="text-sm text-white truncate">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.sku}</p>
                                    </div>
                                    {value.linkId === product.id && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                    {value.linkId && !searchQuery && (
                        <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                            Link set to: {value.link}
                        </div>
                    )}
                </div>
            )}

            {value.linkType === 'CATEGORY' && (
                <div className="relative">
                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <select
                        value={value.linkId || ""}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const cat = categories.find(c => c.id === selectedId);
                            const generatedLink = cat ? `/collection/${cat.slug || cat.id}` : "";
                            onChange({ ...value, linkId: selectedId, link: generatedLink });
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}
