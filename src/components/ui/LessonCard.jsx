"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark, FiLock, FiArrowRight, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import BaseButton from "./BaseButton";

const LessonCard = ({ lesson, onLikeToggle, onBookmarkToggle }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data: session } = authClient.useSession();

  // Destructure real database keys provided in schema configuration
  const {
    _id = "",
    title = "Untitled Insight Log",
    description = "",
    authorName = "Anonymous",
    authorImg = "",
    image = "",
    likesCount = 0,
    CommentsCount = 0,
    category = "Unclassified",
    emotionalTone = "Neutral",
    accessLevel = "Free",
    createdAt = new Date().toISOString(),
  } = lesson || {};

  // Validate user access levels
  const isAdmin = session?.user?.role === "admin";
  const isPremiumUser = session?.user?.isPremium === true;
  const hasFullAccess = isAdmin || isPremiumUser;
  const isPremiumLesson = accessLevel === "Premium";
  
  // Guard lock evaluation until mounted on client
  const isLocked = isMounted && isPremiumLesson && !hasFullAccess;

  // Local interaction tracking states
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sync state if initial prop changes
  useEffect(() => {
    setLocalLikes(likesCount);
  }, [likesCount]);

  const handleLikeClick = (e) => {
    e.preventDefault();
    if (isLocked) return;
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLocalLikes((prev) => (nextState ? prev + 1 : prev - 1));
    if (onLikeToggle) {
      onLikeToggle(_id, nextState);
    }
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    if (isLocked) return;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (onBookmarkToggle) {
      onBookmarkToggle(_id, nextState);
    }
  };

  // Safe Date Formatting Pattern for Server Alignment
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative bg-card border border-border hover:border-border-hover rounded-2xl p-4 flex flex-col justify-between h-full shadow-xs transition-all duration-300 group hover:-translate-y-1 overflow-hidden">
      
      {/* Premium Shield Protection Mask Layer */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 z-20 backdrop-blur-sm bg-[#FAF8F3]/70 dark:bg-[#1E1E1E]/70 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.05 }}
              className="p-3 bg-primary/10 border border-primary/20 rounded-full text-primary mb-3 shadow-xs animate-pulse"
            >
              <FiLock className="w-6 h-6" aria-hidden="true" />
            </motion.div>
            
            <motion.h4 
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-base font-bold text-foreground tracking-tight"
            >
              Premium Insight
            </motion.h4>
            
            <motion.p 
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="text-xs text-muted max-w-55 mt-1.5 leading-normal"
            >
              Upgrade your membership to unlock this strategy log.
            </motion.p>
            
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-full max-w-45"
            >
              <BaseButton
                as="link"
                href="/pricing"
                animated
                animatedSpanOne="animate-ping"
                className="mt-4 w-full text-xs font-semibold px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                Unlock Lesson
              </BaseButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Structural Inner Component Layout Wrapper */}
      <div className={`flex flex-col h-full justify-between ${isLocked ? "select-none pointer-events-none blur-[2px] opacity-40" : ""}`}>
        
        <div>
          {/* Main Visual Image Asset Mask */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface mb-4">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority
                className="object-fit transition-transform duration-500 group-hover:scale-103"
              />
            ) : (
              <div className="w-full h-full bg-surface border border-border flex items-center justify-center text-xs text-muted">
                No Media Connected
              </div>
            )}
            
            {/* Structural Access Level Level-Badge Overlay */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md shadow-xs ${
                isPremiumLesson 
                  ? "bg-primary text-white" 
                  : "bg-surface border border-border text-foreground"
              }`}>
                {accessLevel}
              </span>
            </div>
          </div>

          {/* Dynamic Category and Emotional Tone Badge Layout Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block text-xs px-2.5 py-0.5 rounded-full tracking-wide text-secondary bg-secondary/10 font-semibold">
              {category}
            </span>
            {emotionalTone && (
              <span className="inline-block text-xs px-2.5 py-0.5 rounded-full tracking-wide text-muted bg-surface border border-border font-medium">
                {emotionalTone}
              </span>
            )}
          </div>

          {/* Primary Text Information Blocks */}
          <h3 className="text-base font-bold text-foreground line-clamp-1 leading-snug tracking-tight group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          
          {description && (
            <p className="text-xs text-muted line-clamp-2 mt-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Inline Structural Calendar Creation String */}
          <div className="flex items-center gap-1.5 text-muted mt-3 mb-4">
            <FiCalendar className="w-3.5 h-3.5 text-muted/80" aria-hidden="true" />
            <time className="text-[11px] font-medium tracking-wide" dateTime={createdAt}>
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Layout Footer Core Alignment Zone */}
        <div className="space-y-4 pt-3 border-t border-border/60">
          
          {/* Author/Creator Identity Card Component Block */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border bg-surface flex items-center justify-center shrink-0">
              {authorImg ? (
                <Image
                  src={authorImg}
                  alt={authorName}
                  fill
                  unoptimized
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold text-primary uppercase">
                  {authorName.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-foreground truncate">{authorName}</span>
          </div>

          {/* Operational Action Trigger Matrix Area */}
          <div className="flex items-center justify-between gap-2 text-muted text-xs font-medium pt-1">
            <div className="flex items-center gap-3">
              
              {/* Interaction Metrics Layout Row: Like Button */}
              <button
                onClick={handleLikeClick}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={`Like this insight log, current count: ${localLikes}`}
                className={`flex items-center gap-1.5 py-1 px-1.5 rounded-lg transition-colors focus:outline-hidden ${
                  isLiked 
                    ? "text-primary bg-primary/5" 
                    : "hover:text-primary hover:bg-surface"
                }`}
              >
                {isLiked ? (
                  <AiFillHeart className="w-4 h-4 text-primary" aria-hidden="true" />
                ) : (
                  <AiOutlineHeart className="w-4 h-4" aria-hidden="true" />
                )}
                <span className="font-semibold text-[11px]">{localLikes}</span>
              </button>

              {/* Interaction Metrics Layout Row: Comment Marker */}
              <div 
                className="flex items-center gap-1.5 py-1 px-1.5 text-muted/90"
                aria-label={`Total user reflections: ${CommentsCount}`}
              >
                <BiCommentDetail className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold text-[11px]">{CommentsCount}</span>
              </div>
            </div>

            {/* Trailing Control Matrix Elements */}
            <div className="flex items-center gap-1.5">
              
              {/* Context Bookmark Button Element */}
              <button
                onClick={handleBookmarkClick}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={isBookmarked ? "Remove bookmark from your collection" : "Save this insight to your bookmark collection"}
                className={`transition-colors p-1.5 rounded-lg border border-transparent focus:outline-hidden ${
                  isBookmarked 
                    ? "text-secondary bg-secondary/5" 
                    : "hover:text-secondary hover:bg-surface"
                }`}
              >
                <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-secondary stroke-secondary" : ""}`} aria-hidden="true" />
              </button>

              {/* Direct Path Link Navigation Button */}
              <Link
                href={`/explore/${_id}`}
                disabled={isLocked}
                tabIndex={isLocked ? -1 : 0}
                aria-label={`See full details for lesson titled: ${title}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-surface hover:bg-border/40 text-foreground border border-border px-3 py-1.5 rounded-lg transition-all"
              >
                <span>Details</span>
                <FiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LessonCard;