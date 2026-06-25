"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiHeart, FiEye, FiTrash2, FiFolder, FiSmile, FiLoader, FiSliders } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

// Defined constants as per your requirements
const CATEGORIES = [
    "Personal Growth",
    "Career",
    "Relationships",
    "Mindset",
    "Mistakes Learned"
];

const EMOTIONAL_TONES = [
    "Motivational",
    "Sad",
    "Realization",
    "Gratitude"
];

export default function MyFavoritesPage() {
    const router = useRouter();
    const { data: session, isPending: sessionLoading } = authClient.useSession();
    
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Default to "All" for filters, but map options from constants
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [toneFilter, setToneFilter] = useState("All");

    useEffect(() => {
        if (!sessionLoading && session) {
            fetchFavorites();
        }
    }, [session, sessionLoading]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/favorites?userId=${session.user.id}`);
            const data = await res.json();
            if (data.success) setFavorites(data.data);
        } catch (err) {
            toast.error("Failed to load favorites.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (lessonId, title) => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/lessons/${lessonId}/favorite`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: session.user.id })
            });
            
            if (res.ok) {
                setFavorites(prev => prev.filter(l => l._id !== lessonId));
                toast.success(`Removed "${title}"`);
            }
        } catch (err) {
            toast.error("Error updating favorites");
        }
    };

    const filteredData = useMemo(() => {
        return favorites.filter(item => {
            const matchCat = categoryFilter === "All" || item.category === categoryFilter;
            const matchTone = toneFilter === "All" || item.emotionalTone === toneFilter;
            return matchCat && matchTone;
        });
    }, [favorites, categoryFilter, toneFilter]);

    if (sessionLoading || loading) return (
        <div className="flex h-64 items-center justify-center"><FiLoader className="animate-spin text-primary text-3xl" /></div>
    );

    return (
        <main className="p-8 max-w-7xl mx-auto text-foreground">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3"><FiHeart className="text-primary" /> My Favorites</h1>
            <p className="text-muted mb-8">Manage your saved lessons and insights.</p>

            {/* Filter Bar with Constants Mapping */}
            <div className="flex gap-4 mb-6 bg-card p-4 rounded-2xl border border-border items-center">
                <FiSliders className="text-primary" />
                
                <select onChange={(e) => setCategoryFilter(e.target.value)} className="bg-surface p-2 rounded-lg text-sm border border-border">
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                
                <select onChange={(e) => setToneFilter(e.target.value)} className="bg-surface p-2 rounded-lg text-sm border border-border">
                    <option value="All">All Tones</option>
                    {EMOTIONAL_TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface text-muted uppercase text-xs font-bold border-b border-border">
                        <tr>
                            <th className="p-4">Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Tone</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <AnimatePresence>
                            {filteredData.map((lesson) => (
                                <motion.tr key={lesson._id} exit={{ opacity: 0 }} className="hover:bg-surface/50">
                                    <td className="p-4 font-medium">{lesson.title}</td>
                                    <td className="p-4 text-sm text-muted">{lesson.category}</td>
                                    <td className="p-4 text-sm text-muted">{lesson.emotionalTone}</td>
                                    <td className="p-4 flex gap-2 justify-end">
                                        <button aria-label="View Details" onClick={() => router.push(`/lessons/${lesson._id}`)} className="p-2 border rounded-xl hover:bg-surface"><FiEye /></button>
                                        <button aria-label="Remove Favorite" onClick={() => handleRemove(lesson._id, lesson.title)} className="p-2 border rounded-xl hover:bg-red-50 hover:text-red-500"><FiTrash2 /></button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </main>
    );
}