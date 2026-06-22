
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiTrendingUp } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import LessonCard from "@/components/ui/LessonCard";

export default function PublicLessonsDirectory({ 
  initialLessons = [], 
  itemsPerPage = 8 
}) {
  // Client Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTone, setSelectedTone] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search updates smoothly to prevent input lag
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); 
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Extract distinct Category parameters dynamically
  const dynamicCategories = useMemo(() => {
    const unique = new Set(initialLessons.map(item => item.category).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [initialLessons]);

  // Extract distinct Emotional Tone parameters dynamically
  const dynamicTones = useMemo(() => {
    const unique = new Set(initialLessons.map(item => item.emotionalTone).filter(Boolean));
    return ["All", ...Array.from(unique)];
  }, [initialLessons]);

  // Combined Single-Pass Processing Architecture
  const filteredAndSortedLessons = useMemo(() => {
    let dataset = [...initialLessons];

    // 1. Text Search Execution
    if (debouncedSearch.trim() !== "") {
      const targetQuery = debouncedSearch.toLowerCase();
      dataset = dataset.filter(lesson => 
        (lesson.title && lesson.title.toLowerCase().includes(targetQuery)) ||
        (lesson.description && lesson.description.toLowerCase().includes(targetQuery))
      );
    }

    // 2. Category Filter Evaluation
    if (selectedCategory !== "All") {
      dataset = dataset.filter(lesson => lesson.category === selectedCategory);
    }

    // 3. Emotional Tone Filter Evaluation
    if (selectedTone !== "All") {
      dataset = dataset.filter(lesson => lesson.emotionalTone === selectedTone);
    }

    // 4. Metric Sorting Evaluation
    dataset.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === "most-saved") {
        const scoreA = (a.likesCount || 0) + (a.CommentsCount || 0);
        const scoreB = (b.likesCount || 0) + (b.CommentsCount || 0);
        return scoreB - scoreA;
      }
      return 0;
    });

    return dataset;
  }, [initialLessons, debouncedSearch, selectedCategory, selectedTone, sortBy]);

  // Mathematical Calculation of Bounds (Fixes Synchronous Cascading Renders)
  const totalPages = Math.ceil(filteredAndSortedLessons.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  const activePaginatedSlice = useMemo(() => {
    const startingOffset = (activePage - 1) * itemsPerPage;
    return filteredAndSortedLessons.slice(startingOffset, startingOffset + itemsPerPage);
  }, [filteredAndSortedLessons, activePage, itemsPerPage]);

  const changePage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages) {
      setCurrentPage(targetPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* 🛠️ CONTROL CONTROL BAR DOCK */}
      <form 
        className="w-full bg-card border border-border rounded-3xl p-5 shadow-sm transition-all duration-300 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Search Field Element */}
          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label htmlFor="search-input" className="text-xs font-bold uppercase tracking-wider text-muted px-1">
              Search Lessons
            </label>
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keywords..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium transition-all duration-200"
              />
            </div>
          </div>

          {/* Category Dropdown Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category-select" className="text-xs font-bold uppercase tracking-wider text-muted px-1 inline-flex items-center gap-1">
              <FiFilter className="w-3 h-3" /> Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 bg-surface text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              {dynamicCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Emotional Tone Dropdown Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tone-select" className="text-xs font-bold uppercase tracking-wider text-muted px-1 inline-flex items-center gap-1">
              <FiFilter className="w-3 h-3" /> Emotional Tone
            </label>
            <select
              id="tone-select"
              value={selectedTone}
              onChange={(e) => { setSelectedTone(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 bg-surface text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              {dynamicTones.map(tone => (
                <option key={tone} value={tone}>{tone}</option>
              ))}
            </select>
          </div>

          {/* Sorting Direction Dropdown Selection */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sort-select" className="text-xs font-bold uppercase tracking-wider text-muted px-1 inline-flex items-center gap-1">
              <FiTrendingUp className="w-3 h-3" /> Sort By
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium transition-all duration-200 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="most-saved">Most Saved & Liked</option>
            </select>
          </div>

        </div>
      </form>

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite">
        Showing {filteredAndSortedLessons.length} items. Page {activePage} of {totalPages}.
      </div>

      {/* 🎯 DATA GRID LAYER WIRE ROUTING */}
      <div>
        {activePaginatedSlice.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {activePaginatedSlice.map((item) => (
              <LessonCard key={item._id} lesson={item} />
            ))}
          </div>
        ) : (
          <div className="w-full py-12 flex justify-center items-center">
            <EmptyState />
          </div>
        )}
      </div>

      {/* 📑 PAGINATION NAVIGATION COMPONENT ROW */}
      {totalPages > 1 && (
        <nav 
          className="w-full flex items-center justify-center pt-6 gap-4 select-none"
          aria-label="Lessons pagination navigation selector"
        >
          <button
            type="button"
            onClick={() => changePage(activePage - 1)}
            disabled={activePage === 1}
            className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Desktop Direct-Jump Buttons Block */}
          <div className="hidden sm:flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => changePage(num)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  activePage === num
                    ? "bg-primary text-white"
                    : "bg-card text-foreground border border-border hover:bg-surface"
                }`}
                aria-current={activePage === num ? "page" : undefined}
              >
                {num}
              </button>
            ))}
          </div>

          <span className="sm:hidden text-sm font-medium text-muted">
            Page {activePage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => changePage(activePage + 1)}
            disabled={activePage === totalPages}
            className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span>Next</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}

    </div>
  );
}