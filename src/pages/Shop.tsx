import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Filter, ShoppingBag, Heart, Eye, Search, ChevronDown, X } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';

const Shop = () => {
    const { slug } = useParams();
    const { addToCart, cart, removeFromCart } = useCart();
    const { products, categories, loading } = useProducts();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    // Default price range 50 - 1000
    const [priceRange, setPriceRange] = useState<[number, number]>([50, 1000]);
    const [sortBy, setSortBy] = useState('default');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Calculate Dynamic Category Counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};

        // Exact match counts for each sub-category or primary category
        products.forEach(product => {
            const catSlug = product.categorySlug;
            if (catSlug) {
                counts[catSlug] = (counts[catSlug] || 0) + 1;
            }
        });

        // Sum up counts for parent categories (Sum of children)
        categories.filter(c => !c.parent).forEach(parent => {
            let total = counts[parent.slug] || 0;
            const children = categories.filter(c => c.parent === parent.slug);
            children.forEach(child => {
                total += counts[child.slug] || 0;
            });
            counts[`p-${parent.slug}`] = total;
        });

        return counts;
    }, [products, categories]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [slug, searchQuery, priceRange, sortBy]);

    // Determine current category from slug
    const currentCategory = slug ? categories.find(c => c.slug === slug) : null;

    // Use a lazy initializer or effect to set initial expanded state based on slug
    const [expandedCategory, setExpandedCategory] = useState<string | null>(() => {
        if (!slug) return null;
        // If slug is a parent, expand it
        if (categories.some(c => c.slug === slug && !c.parent)) return slug;
        // If slug is a child, expand its parent
        const child = categories.find(c => c.slug === slug && c.parent);
        return child ? child.parent! : null;
    });

    let pageTitle = 'Shop';
    if (searchQuery) {
        pageTitle = `Search Results: "${searchQuery}"`;
    } else if (currentCategory) {
        pageTitle = currentCategory.name;
    }

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Price Filter
        const pPrice = Number(product.price);
        if (isNaN(pPrice) || pPrice < priceRange[0] || pPrice > priceRange[1]) {
            return false;
        }

        // Search Query Filter
        if (searchQuery) {
            const matchesName = product.name.toLowerCase().includes(searchQuery);
            const matchesCategory = product.category.toLowerCase().includes(searchQuery);
            const matchesDescription = product.description?.toLowerCase().includes(searchQuery);
            if (!matchesName && !matchesCategory && !matchesDescription) return false;
        }

        // Category Filter
        if (slug) {
            const validSlugs = [slug]; // Always include itself

            // Add children if this is a parent category
            categories.filter(c => c.parent === slug).forEach(c => validSlugs.push(c.slug));

            // Check using categorySlug property if available (Robust)
            if (product.categorySlug) {
                return validSlugs.includes(product.categorySlug);
            }

            // Fallback: Use Name matching (Legacy/Fragile)
            const relevantCategoryNames = categories
                .filter(c => validSlugs.includes(c.slug))
                .map(c => c.name);

            const match = relevantCategoryNames.includes(product.category);
            return match;
        }

        return true;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        return 0; // default
    });

    // Pagination Logic
    const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <MainLayout>
            <Helmet>
                <title>{pageTitle} - Kottravai</title>
            </Helmet>


            <div className="container mx-auto px-4 pt-4 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <div className="hidden lg:block w-1/4 space-y-8 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Categories Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#b5128f]/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#b5128f]/10 transition-all duration-500"></div>

                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-[#b5128f] rounded-full"></div>
                                    <h3 className="font-bold text-xl text-[#2D1B4E] tracking-tight">Categories</h3>
                                </div>
                                {(slug || priceRange[0] !== 50 || priceRange[1] !== 1000 || searchQuery) && (
                                    <Link
                                        to="/shop"
                                        className="text-[10px] font-black uppercase tracking-widest text-[#b5128f] hover:underline"
                                        onClick={() => {
                                            setPriceRange([50, 1000]);
                                            setExpandedCategory(null);
                                        }}
                                    >
                                        Clear All
                                    </Link>
                                )}
                            </div>


                            <ul className="space-y-2 relative z-10">
                                <li className="group/item">
                                    <Link to="/shop"
                                        className={`flex justify-between items-center p-3 rounded-xl transition-all duration-300 ${!slug ? 'bg-[#b5128f]/10 text-[#b5128f]' : 'text-[#2D1B4E] hover:bg-gray-50'}`}
                                        onClick={() => setExpandedCategory(null)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg transition-colors ${!slug ? 'bg-[#b5128f]/10' : 'bg-gray-100 group-hover/item:bg-white'}`}>
                                                <ShoppingBag size={16} className={!slug ? 'text-[#b5128f]' : 'text-gray-400'} />
                                            </div>
                                            <span className={`font-bold text-sm ${!slug ? 'text-[#b5128f]' : 'text-gray-700'}`}>All Products</span>
                                        </div>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${!slug ? 'bg-[#b5128f] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {products.length}
                                        </span>
                                    </Link>
                                </li>

                                {categories.filter(c => !c.parent).map((parent) => {
                                    const isExpanded = expandedCategory === parent.slug;
                                    const isActive = slug === parent.slug;
                                    const hasChildren = categories.some(c => c.parent === parent.slug);
                                    const parentCount = categoryCounts[`p-${parent.slug}`] || 0;

                                    return (
                                        <div key={parent.slug} className="pt-1">
                                            <div className="group/parent flex items-center">
                                                <Link
                                                    to={`/category/${parent.slug}`}
                                                    className={`flex items-center justify-between flex-1 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#b5128f]/10 text-[#b5128f]' : 'text-[#2D1B4E] hover:bg-gray-50'}`}
                                                    onClick={() => {
                                                        if (hasChildren) {
                                                            setExpandedCategory(parent.slug === expandedCategory ? null : parent.slug);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`font-bold text-sm ${isActive ? 'text-[#b5128f]' : 'text-gray-700'}`}>{parent.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-[#b5128f] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {parentCount}
                                                        </span>
                                                        {hasChildren && (
                                                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                                <ChevronDown size={14} className={isActive ? 'text-[#b5128f]' : 'text-gray-400'} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Subcategories Accordion avec animation fluide */}
                                            <div className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}`}>
                                                <ul className="pl-6 space-y-1 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-gray-100 before:rounded-full">
                                                    {categories.filter(c => c.parent === parent.slug).map(child => {
                                                        const isChildActive = slug === child.slug;
                                                        return (
                                                            <li key={child.slug}>
                                                                <Link
                                                                    to={`/category/${child.slug}`}
                                                                    className={`group/child flex justify-between items-center p-2 rounded-lg text-xs transition-colors ${isChildActive ? 'text-[#b5128f] font-bold bg-[#b5128f]/5' : 'text-gray-500 hover:text-[#b5128f] hover:bg-gray-50'}`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-1 h-1 rounded-full transition-all ${isChildActive ? 'bg-[#b5128f] scale-150' : 'bg-gray-300 group-hover/child:bg-[#b5128f]'}`}></div>
                                                                        <span>{child.name}</span>
                                                                    </div>
                                                                    <span className={`text-[9px] font-medium ${isChildActive ? 'text-[#b5128f]' : 'text-gray-400'}`}>
                                                                        {categoryCounts[child.slug] || 0}
                                                                    </span>
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Innovative Price Filter Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#b5128f]/5 to-transparent rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#b5128f]/10 transition-all duration-500"></div>

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-1.5 h-6 bg-[#b5128f] rounded-full"></div>
                                <h3 className="font-bold text-xl text-[#2D1B4E] tracking-tight">Price Range</h3>
                            </div>

                            <div className="relative z-10 px-1">
                                <div className="space-y-6">
                                    {/* Styled Range Slider */}
                                    <div className="relative pt-6 pb-2">
                                        <input
                                            type="range"
                                            min="50" max="1000"
                                            step="10"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                            className="w-full accent-[#b5128f] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b5128f]/20 transition-all"
                                        />
                                        <div className="flex justify-between mt-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Min Price</span>
                                                <div className="flex items-center text-sm font-bold text-[#2D1B4E] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                                    <span className="text-gray-400 mr-1 text-[10px]">₹</span>
                                                    <input
                                                        type="number"
                                                        value={priceRange[0]}
                                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                                        className="bg-transparent border-none p-0 focus:ring-0 w-12 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Max Price</span>
                                                <div className="flex items-center text-sm font-bold text-[#b5128f] bg-[#b5128f]/5 px-3 py-1.5 rounded-lg border border-[#b5128f]/10">
                                                    <span className="mr-1 text-[10px]">₹</span>
                                                    <input
                                                        type="number"
                                                        value={priceRange[1]}
                                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                                                        className="bg-transparent border-none p-0 focus:ring-0 w-16 text-sm text-right font-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <button
                                        onClick={() => setPriceRange([50, 1000])}
                                        className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Horizontal Scrollable Categories */}
                    <div className="lg:hidden space-y-3 mb-6">
                        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar pb-1">
                            <div className="flex gap-2 min-w-max">
                                <Link
                                    to="/shop"
                                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${!slug ? 'bg-[#b5128f] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
                                >
                                    All Items
                                </Link>
                                {categories.filter(c => !c.parent).map((parent) => {
                                    const parentOfCurrent = slug ? categories.find(c => c.slug === slug)?.parent : null;
                                    const isActive = slug === parent.slug || parentOfCurrent === parent.slug;

                                    return (
                                        <Link
                                            key={parent.slug}
                                            to={`/category/${parent.slug}`}
                                            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-[#8E2A8B] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
                                        >
                                            {parent.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sub-categories row for mobile - Visible only when a parent is active */}
                        {(slug && (categories.find(c => c.slug === slug && !c.parent) || categories.find(c => c.slug === slug && c.parent))) && (
                            <div className="-mx-4 px-4 overflow-x-auto no-scrollbar pb-1 animate-in fade-in slide-in-from-left duration-300">
                                <div className="flex gap-2 min-w-max">
                                    {(() => {
                                        const current = categories.find(c => c.slug === slug);
                                        const parentSlug = current?.parent || current?.slug;
                                        const subcats = categories.filter(c => c.parent === parentSlug);

                                        if (subcats.length === 0) return null;

                                        return (
                                            <>
                                                <Link
                                                    to={`/category/${parentSlug}`}
                                                    className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${slug === parentSlug ? 'bg-gray-100 text-[#b5128f]' : 'bg-white text-gray-400 border border-gray-50'}`}
                                                >
                                                    All {categories.find(c => c.slug === parentSlug)?.name}
                                                </Link>
                                                {subcats.map(sub => (
                                                    <Link
                                                        key={sub.slug}
                                                        to={`/category/${sub.slug}`}
                                                        className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${slug === sub.slug ? 'bg-[#b5128f]/10 text-[#b5128f] border border-[#b5128f]/20' : 'bg-white text-gray-400 border border-gray-50'}`}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Filter Drawer (Conditional) */}
                    {isMobileFiltersOpen && (
                        <div className="lg:hidden fixed inset-0 z-[200] bg-white overflow-y-auto p-6 animate-in slide-in-from-bottom duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold text-[#2D1B4E]">Filters</h3>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Mobile categories - Matching desktop aesthetics */}
                            <div className="mb-10">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#b5128f] mb-6">Categories</h4>
                                <ul className="space-y-3">
                                    <li className="group/item">
                                        <Link to="/shop"
                                            className={`flex justify-between items-center p-4 rounded-2xl transition-all ${!slug ? 'bg-[#b5128f]/10 text-[#b5128f]' : 'bg-gray-50 text-[#2D1B4E]'}`}
                                            onClick={() => {
                                                setExpandedCategory(null);
                                                setIsMobileFiltersOpen(false);
                                            }}
                                        >
                                            <span className="font-bold text-sm">All Products</span>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${!slug ? 'bg-[#b5128f] text-white' : 'bg-white text-gray-400'}`}>
                                                {products.length}
                                            </span>
                                        </Link>
                                    </li>

                                    {categories.filter(c => !c.parent).map((parent) => {
                                        const isActive = slug === parent.slug;
                                        const parentCount = categoryCounts[`p-${parent.slug}`] || 0;

                                        return (
                                            <div key={parent.slug} className="pt-1">
                                                <Link
                                                    to={`/category/${parent.slug}`}
                                                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive ? 'bg-[#b5128f]/10 text-[#b5128f]' : 'bg-gray-50 text-[#2D1B4E]'}`}
                                                    onClick={() => setIsMobileFiltersOpen(false)}
                                                >
                                                    <span className="font-bold text-sm">{parent.name}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isActive ? 'bg-[#b5128f] text-white' : 'bg-white text-gray-400'}`}>
                                                        {parentCount}
                                                    </span>
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Mobile Price Filter */}
                            <div className="mb-10">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#b5128f] mb-6">Price Limit</h4>
                                <input
                                    type="range"
                                    min="50" max="1000"
                                    step="10"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full accent-[#b5128f] h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer mb-4"
                                />
                                <div className="flex justify-between text-sm font-black text-[#2D1B4E]">
                                    <span>₹50</span>
                                    <span className="text-[#b5128f]">₹{priceRange[1]}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full py-5 bg-[#2D1B4E] text-white rounded-3xl font-black uppercase tracking-widest active:scale-95 transition-transform"
                            >
                                Show {sortedProducts.length} Products
                            </button>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">

                        {/* Professional Skeleton Loader while fetching */}
                        {loading ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-100 rounded-xl h-[400px]"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="bg-white p-6 rounded-full mb-6 relative shadow-sm">
                                    <ShoppingBag size={48} className="text-[#b5128f] opacity-80" />
                                </div>
                                <h2 className="text-3xl font-bold text-[#2D1B4E] mb-4">Store Launching Soon</h2>
                                <p className="text-gray-600 mb-8 max-w-md">
                                    We are adding products to our inventory. Please check back shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Integrated Header & Sorting */}
                                <div className="mb-4">
                                    <div className="flex items-center text-[11px] font-black uppercase tracking-[0.2em] mb-3 ml-1">
                                        <Link to="/" className="text-gray-400 hover:text-[#b5128f] transition-colors">Home</Link>
                                        <span className="mx-3 text-gray-300">/</span>
                                        <Link to="/shop" className="text-gray-400 hover:text-[#b5128f] transition-colors">Shop</Link>
                                        {currentCategory && (
                                            <>
                                                <span className="mx-3 text-gray-300">/</span>
                                                <span className="text-[#b5128f]">{currentCategory.name}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-0 md:relative z-40">
                                        <h1 className="text-lg md:text-xl font-black text-[#2D1B4E] px-2">{pageTitle}</h1>

                                        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
                                            {/* Mobile Filter Toggle Button */}
                                            <button
                                                onClick={() => setIsMobileFiltersOpen(true)}
                                                className="lg:hidden flex flex-1 items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest border border-transparent active:bg-gray-100"
                                            >
                                                <Filter size={14} className="text-[#b5128f]" /> Filters
                                            </button>

                                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">
                                                    {sortedProducts.length} Items
                                                </span>
                                            </div>

                                            {/* Innovative Custom Dropdown */}
                                            <div className="relative flex-1 sm:flex-initial lg:min-w-[200px]">
                                                <button
                                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                                    className={`w-full flex items-center justify-between py-3 px-5 rounded-xl transition-all border ${isSortOpen ? 'bg-white border-[#b5128f] shadow-lg' : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-[#b5128f]/20'
                                                        } text-[11px] font-black uppercase tracking-[0.15em] ${sortBy === 'default' ? 'text-[#b5128f]' : 'text-[#2D1B4E]'}`}
                                                >
                                                    <span>
                                                        {sortBy === 'default' ? 'Newest Arrivals' :
                                                            sortBy === 'price-low' ? 'Price: Low to High' :
                                                                'Price: High to Low'}
                                                    </span>
                                                    <ChevronDown size={14} className={`text-[#b5128f] transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {isSortOpen && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setIsSortOpen(false)}
                                                        ></div>
                                                        <div className="absolute right-0 top-full mt-2 w-full bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            {[
                                                                { value: 'default', label: 'Newest Arrivals' },
                                                                { value: 'price-low', label: 'Price: Low to High' },
                                                                { value: 'price-high', label: 'Price: High to Low' }
                                                            ].map((option) => (
                                                                <button
                                                                    key={option.value}
                                                                    className={`w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors
                                                                        ${sortBy === option.value
                                                                            ? 'bg-[#b5128f] text-white'
                                                                            : 'text-[#2D1B4E] hover:bg-[#b5128f]/5 hover:text-[#b5128f]'}`}
                                                                    onClick={() => {
                                                                        setSortBy(option.value);
                                                                        setIsSortOpen(false);
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentProducts.map((product) => {
                                        const isInCart = cart.some(item => item.id === product.id);
                                        return (
                                            <div key={product.id} className="group flex flex-col bg-white rounded-[22px] overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(181,18,143,0.15)] transition-all duration-300 border border-gray-100/50 relative">

                                                {/* Image Container - Square for compact height */}
                                                <div className="relative aspect-square overflow-hidden bg-[#FAF9F6]">
                                                    <Link to={`/product/${product.slug}`} className="block w-full h-full">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    </Link>

                                                    {/* Wishlist Button - Overlay Top Right */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleWishlist(product);
                                                        }}
                                                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${isInWishlist(product.id)
                                                            ? 'bg-[#EC4899] text-white'
                                                            : 'bg-white/80 backdrop-blur-md text-gray-400 hover:bg-[#b5128f] hover:text-white'
                                                            }`}
                                                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                                                    >
                                                        <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                                                    </button>
                                                </div>

                                                {/* Content Area */}
                                                <div className="p-4 flex-1 flex flex-col">

                                                    {/* Category Tag */}
                                                    <div className="mb-2">
                                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100 group-hover:bg-[#b5128f]/5 group-hover:text-[#b5128f] transition-colors">
                                                            {product.category}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-base font-bold text-[#2D1B4E] leading-tight mb-1 line-clamp-1 group-hover:text-[#b5128f] transition-colors">
                                                        <Link to={`/product/${product.slug}`}>{product.name}</Link>
                                                    </h3>

                                                    {/* Short Description */}
                                                    <p className="text-[11px] text-gray-400 mb-2 line-clamp-1 min-h-[1rem]">
                                                        {product.description || "Premium handcrafted quality"}
                                                    </p>

                                                    {/* Spacer */}
                                                    <div className="mt-auto"></div>

                                                    {/* Price & Action Row */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 pt-3 border-t border-gray-50">

                                                        {/* Price Section */}
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-0.5">Price</span>
                                                            {product.isCustomRequest ? (
                                                                <span className="text-sm font-bold text-[#8E2A8B]">Request Price</span>
                                                            ) : (product.variants && product.variants.length > 0) || Number(product.price) === 0 ? (
                                                                <span className="text-sm font-bold text-[#b5128f]">Check Options</span>
                                                            ) : (
                                                                <div className="text-xl font-black text-[#2D1B4E]">
                                                                    ₹{Number(product.price).toLocaleString('en-IN')}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Button Section */}
                                                        <div className="w-full sm:w-auto">
                                                            {(product.variants && product.variants.length > 0) || Number(product.price) === 0 ? (
                                                                <Link
                                                                    to={`/product/${product.slug}`}
                                                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-50 text-[#2D1B4E] font-bold text-sm hover:bg-[#b5128f] hover:text-white transition-all flex items-center justify-center gap-2"
                                                                >
                                                                    <span>Options</span>
                                                                    <Eye size={16} />
                                                                </Link>
                                                            ) : (
                                                                isInCart ? (
                                                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                                                        <span className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-[#b5128f] text-white cursor-default text-center">
                                                                            Added
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                removeFromCart(product.id);
                                                                            }}
                                                                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                                            title="Remove from Cart"
                                                                        >
                                                                            <X size={18} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            addToCart(product);
                                                                        }}
                                                                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b5128f] to-[#8E2A8B] text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all duration-300"
                                                                    >
                                                                        Add to Cart
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Innovation: Floating Artisanal Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col items-center mt-24 mb-12">
                                        <div className="relative group p-1 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-[0_25px_60px_-15px_rgba(142,42,139,0.15)] flex items-center gap-1">
                                            {/* Previous Button */}
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FAF9F6] text-[#2D1B4E] hover:bg-[#b5128f] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
                                                title="Previous Page"
                                            >
                                                <ChevronDown size={20} className="rotate-90" />
                                            </button>

                                            {/* Pages */}
                                            <div className="flex items-center gap-1">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const pageNum = i + 1;
                                                    const isActive = currentPage === pageNum;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => paginate(pageNum)}
                                                            className={`relative w-12 h-12 flex items-center justify-center text-sm font-black transition-all duration-500 rounded-full
                                                                ${isActive
                                                                    ? 'text-white'
                                                                    : 'text-gray-400 hover:text-[#b5128f] hover:bg-white'}`}
                                                        >
                                                            {isActive && (
                                                                <div className="absolute inset-0 bg-gradient-to-br from-[#b5128f] to-[#d61bab] rounded-full scale-110 animate-in zoom-in-50 duration-300"></div>
                                                            )}
                                                            <span className="relative z-10">{pageNum}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Next Button */}
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FAF9F6] text-[#2D1B4E] hover:bg-[#b5128f] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
                                                title="Next Page"
                                            >
                                                <ChevronDown size={20} className="-rotate-90" />
                                            </button>
                                        </div>

                                        {/* Status Text Underneath */}
                                        <div className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 animate-pulse">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                    </div>
                                )}

                                {sortedProducts.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                                        <Search className="mx-auto text-gray-300 mb-4" size={48} />
                                        <h3 className="text-xl font-bold text-gray-500 mb-2">No products found</h3>
                                        <p className="text-gray-400">Try adjusting your filters.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Shop;
