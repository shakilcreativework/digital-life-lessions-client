"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";

const LessonCard = ({ lesson }) => {
  // 1. Destructure all fields from your payload object directly with safe defaults
  const {
    category = "Unclassified",
    title = "Untitled Insight Log",
    description = "",
    authorName = "Anonymous",
    authorImg = "",
    image = "",          // Maps directly to your payload.image (ImgBB URL)
    likesCount = 0,
    CommentsCount = 0,   // Matches your payload uppercase 'C' parameter exactly
  } = lesson || {};

  // 2. Local state trackers for instant UI micro-interactions
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLikeToggle = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLocalLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="bg-card border border-border hover:border-border-hover rounded-2xl p-4 flex flex-col justify-between h-full shadow-sm transition-all duration-300 group hover:-translate-y-1">
      
      <div>
        {/* Card Artwork Wrapper */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface mb-4">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              unoptimized // 💡 Crucial: Bypasses Next.js domain verification errors for external ImgBB URLs
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
              No Media Asset Connected
            </div>
          )}
        </div>

        {/* Dynamic Category Tag */}
        <span className="inline-block text-xs px-2.5 py-0.5 shadow-xs border border-border rounded-full mb-3 tracking-wide text-primary bg-primary/10 font-medium">
          {category}
        </span>

        {/* Title & Optional Description Snippet */}
        <h3 className="text-base font-bold text-foreground line-clamp-1 leading-snug tracking-tight group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Footer Area: Author and Performance Metrics */}
      <div className="space-y-4 pt-4">

        {/* Author Avatar Group */}
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center">
            {authorImg ? (
              <Image
                src={authorImg}
                alt={authorName}
                fill
                unoptimized // Bypasses domain check for Google Auth user profile avatars
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <span className="text-[10px] font-black text-primary uppercase">
                {authorName.charAt(0)}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{authorName}</span>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between text-muted-foreground text-xs font-medium pt-2 border-t border-border/40">
          <div className="flex items-center gap-4">

            {/* Likes Trigger Field */}
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 transition-colors focus:outline-none ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
            >
              {isLiked ? <AiFillHeart className="w-4 h-4 text-red-500" /> : <AiOutlineHeart className="w-4 h-4" />}
              <span>{localLikes}</span>
            </button>

            {/* Comments Counter Display */}
            <button className="flex items-center gap-1.5 hover:text-success transition-colors focus:outline-none">
              <BiCommentDetail className="w-4 h-4" />
              <span>{CommentsCount}</span>
            </button>
          </div>

          {/* Bookmark Button */}
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors p-1 rounded-md hover:bg-surface focus:outline-none ${isBookmarked ? "text-amber-500" : "hover:text-amber-500"}`}
          >
            <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 stroke-amber-500" : ""}`} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default LessonCard;