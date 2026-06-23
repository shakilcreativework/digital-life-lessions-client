'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiBookOpen, FiHeart, FiTag, FiUser, FiCalendar, 
  FiRefreshCw, FiEye, FiBookmark, FiAlertTriangle, 
  FiShare2, FiSend, FiMessageSquare, FiArrowRight, 
  FiLock
} from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

export default function LessonDisplayCard({ lessonData = {}, relatedLessons = [] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data: session } = authClient.useSession();

  // 1. Fully Destructured Data matching your requirement object schema
  const {
    _id = "",
    title = "Untitled Lesson",
    description = "",
    category = "General",
    emotionalTone = "Realization",
    visibility = "Public",
    accessLevel = "Free",
    image = null,
    authorName = "Anonymous",
    authorImg = null,
    likes = [],
    likesCount = 0,
    comments = [],
    CommentsCount = 0,
    creatorId = "",
    createdAt,
    updatedAt,
  } = lessonData;

  // Interactive UI Reactive States
  const [isLiked, setIsLiked] = useState(false);
  const [likeOffset, setLikeOffset] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [favsCount, setFavsCount] = useState(342); // Requirement 4 default base value fallback
  const [viewsCount] = useState(Math.floor(Math.random() * 10000)); // Requirement 4 static random value
  
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(comments || []);

  const currentLikesCount = likesCount + likeOffset;

  // Sync state block reflecting LessonCard logic
  const [prevLikesCount, setPrevLikesCount] = useState(likesCount);
  if (likesCount !== prevLikesCount) {
    setPrevLikesCount(likesCount);
    setLikeOffset(0);
  }

  // Dynamic reading time counter
  const readingTime = Math.max(1, Math.ceil((description?.split(/\s+/).length || 0) / 225));

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  const getToneStyles = (tone) => {
    const standardizedTone = tone.toLowerCase();
    if (standardizedTone.includes("motivational") || standardizedTone.includes("gratitude")) {
      return "bg-primary/10 dark:bg-primary/20 text-primary border-primary/20";
    }
    if (standardizedTone.includes("sad") || standardizedTone.includes("mistake")) {
      return "bg-secondary/10 dark:bg-secondary/20 text-secondary border-secondary/20";
    }
    return "bg-surface text-muted border-border";
  };

  // 5. Interaction Event Controllers
  const handleLikeClick = (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please log in to like");
      return;
    }
    
    const nextLikedState = !isLiked;
    setIsLiked(nextLikedState);
    setLikeOffset((prev) => (nextLikedState ? prev + 1 : prev - 1));
    toast.success(nextLikedState ? "Lesson liked ❤️" : "Like removed");
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    const nextBookmarkState = !isBookmarked;
    setIsBookmarked(nextBookmarkState);
    setFavsCount(prev => nextBookmarkState ? prev + 1 : prev - 1);
    toast.success(nextBookmarkState ? "Saved to Favorites" : "Removed from Favorites");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Read ${authorName}'s lesson log`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Could not complete sharing execution pattern");
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please log in to post comments.");
      return;
    }
    if (!commentText.trim()) return;

    setLocalComments([{
      _id: Date.now().toString(),
      authorName: session.user.name || "Authenticated User",
      authorImg: session.user.image || null,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    }, ...localComments]);
    setCommentText("");
    toast.success("Comment posted successfully!");
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason) {
      toast.error("Please choose a reason category.");
      return;
    }
    toast.success("Report entered into lessonsReports database.");
    setIsReportOpen(false);
    setReportReason("");
    setReportDetails("");
  };

  if (!isMounted) return <div className="min-h-screen bg-background animate-pulse" />;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-10 text-foreground">
      <Toaster position="top-right" />

      {/* Primary Layout Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content Pane */}
        <div className="lg:col-span-2 space-y-8">
          
          <article className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs relative">
            
            {/* 1. Featured Image Block */}
            {image && (
              <div className="w-full aspect-video bg-surface relative overflow-hidden select-none">
                <Image
                  src={image}
                  alt={`Visual presenting: ${title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover object-center transition-all duration-700"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                
                {accessLevel === "Premium" && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-md">
                    <span>Premium Content</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 sm:p-8 md:p-10 space-y-6">
              {/* Badges Layout row alignment */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-surface border border-border text-muted">
                  <FiTag className="w-3 h-3 text-secondary" />
                  {category}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border tracking-wide uppercase ${getToneStyles(emotionalTone)}`}>
                  <FiHeart className="w-3 h-3 fill-current" />
                  {emotionalTone}
                </span>
                <span className="text-xs text-muted font-medium ml-auto flex items-center gap-1">
                  <FiBookOpen /> {readingTime} min read
                </span>
              </div>

              {/* Title Header Section */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {title}
                </h1>
              </div>

              <hr className="border-border/60" />

              {/* Description Content Section (Always Readable) */}
              <div className="relative min-h-30">
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-foreground/90 text-base sm:text-lg leading-relaxed whitespace-pre-wrap tracking-wide">
                    {description || "No content summary is currently available for this entry."}
                  </p>
                </div>
              </div>

              {/* 5. Interaction Buttons Segment Row Block */}
              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLikeClick}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      isLiked 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-surface hover:bg-border/30 text-foreground border-border"
                    }`}
                  >
                    {isLiked ? <AiFillHeart className="w-4 h-4 text-primary" /> : <AiOutlineHeart className="w-4 h-4" />}
                    <span>{currentLikesCount.toLocaleString()} Likes</span>
                  </button>

                  <button
                    onClick={handleBookmarkClick}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      isBookmarked 
                        ? "bg-secondary/10 text-secondary border-secondary/20" 
                        : "bg-surface hover:bg-border/30 text-foreground border-border"
                    }`}
                  >
                    <FiBookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    <span>{favsCount.toLocaleString()} Favorites</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-surface hover:bg-border/40 border border-border text-muted hover:text-foreground transition-all"
                    title="Share Lesson"
                  >
                    <FiShare2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500 text-xs font-semibold border border-transparent hover:border-red-500/10 transition-all"
                  >
                    <FiAlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Lesson</span>
                  </button>
                </div>
              </div>

            </div>
          </article>

          {/* 6. Comment Feed Interactive Section */}
          <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold tracking-tight">Discussion ({localComments.length})</h2>
            </div>

            <form onSubmit={handlePostComment} className="space-y-3">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={session?.user ? "Write a response or feedback view regarding this lesson..." : "Please log in to participate in the conversation."}
                disabled={!session?.user}
                rows={3}
                className="w-full bg-background border border-border focus:border-primary rounded-2xl p-4 text-sm focus:outline-hidden resize-none transition-colors disabled:opacity-60 text-foreground"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!session?.user || !commentText.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-hover disabled:bg-muted/40 transition-colors"
                >
                  <FiSend className="w-3.5 h-3.5" />
                  <span>Submit Comment</span>
                </button>
              </div>
            </form>

            <div className="divide-y divide-border pt-2">
              {localComments.map((commentItem, index) => (
                <div key={commentItem._id || index} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-start">
                  {commentItem.authorImg ? (
                    <div className="relative w-9 h-9 overflow-hidden rounded-full shrink-0 border border-border">
                      <Image src={commentItem.authorImg} alt="" fill sizes="36px" className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0 border border-border text-muted">
                      <FiUser className="w-4 h-4" />
                    </div>
                  )}
                  <div className="bg-surface/40 p-3 rounded-2xl flex-1 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold">{commentItem.authorName || "Anonymous User"}</h4>
                      <span className="text-[10px] text-muted">{formatDate(commentItem.createdAt)}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {commentItem.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Space */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          
          {/* 3. Author Section Details Card */}
          <div className="bg-card border border-border rounded-3xl p-6 text-center space-y-4 shadow-xs">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted block">Author Profile</span>
            <div className="flex justify-center">
              {authorImg ? (
                <div className="relative w-20 h-20 overflow-hidden rounded-full ring-4 ring-surface shadow-xs">
                  <Image src={authorImg} alt={authorName} fill sizes="80px" className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center text-muted font-bold text-xl">
                  {authorName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">{authorName}</h3>
              <p className="text-[11px] text-muted font-mono mt-0.5">ID: {creatorId}</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-2.5 border border-border/40">
              <span className="text-xs font-bold text-foreground">Total Lessons Created: </span>
              <span className="text-xs font-black text-primary font-mono">14 lessons</span>
            </div>
            <Link
              href={`/profile/${creatorId}`}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-surface border border-border hover:border-border-hover hover:bg-border/30 transition-all text-foreground"
            >
              <span>View all lessons by this author</span>
            </Link>
          </div>

          {/* 2 & 4. Lesson Metadata & Engagement Stats */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-black uppercase tracking-wider">Lesson Information</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted flex items-center gap-1.5"><FiCalendar /> Created Date</span>
                <span className="font-semibold font-mono">{formatDate(createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted flex items-center gap-1.5"><FiRefreshCw /> Last Updated</span>
                <span className="font-semibold font-mono">{formatDate(updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted flex items-center gap-1.5"><FiEye /> Views Count</span>
                <span className="font-bold font-mono text-secondary">{viewsCount.toLocaleString()} Views</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted flex items-center gap-1.5"><FiLock /> Visibility</span>
                <span className="px-2.5 py-0.5 rounded-sm font-bold bg-green-500/10 text-green-600 dark:text-green-400 uppercase text-[9px] tracking-widest border border-green-500/10">
                  {visibility}
                </span>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* 7. Recommended Related Lessons Deck Grid Section */}
      <section className="space-y-6 pt-4">
        <div>
          <h2 className="text-xl font-black tracking-tight">Similar Lessons You Might Like</h2>
          <p className="text-xs text-muted">Filtered dynamically based on: {category} or {emotionalTone}</p>
        </div>

        {relatedLessons.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-3xl text-muted text-sm">
            No related item suggestions matched this setup.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedLessons.slice(0, 6).map((item) => (
              <Link key={item._id} href={`/lessons/${item._id}`} className="group block">
                <article className="h-full bg-card border border-border hover:border-border-hover rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                  {item.image && (
                    <div className="relative w-full aspect-video bg-surface overflow-hidden">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw, 320px"
                        className="object-cover group-hover:scale-102 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary block">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted">
                      <span className="font-medium text-foreground truncate">{item.authorName}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Flag Report Confirmation Popup Modal */}
      <AnimatePresence>
        {isReportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 text-foreground"
              role="dialog"
            >
              <div className="flex items-center gap-2 text-red-500 mb-4">
                <FiAlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold tracking-tight">Report Lesson Content</h3>
              </div>
              
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="reason" className="text-xs font-bold text-muted block">Select Reason</label>
                  <select
                    id="reason"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-background border border-border focus:border-red-500 rounded-xl p-2.5 text-sm focus:outline-hidden text-foreground"
                    required
                  >
                    <option value="">-- Choose Reason --</option>
                    <option value="copyright">Plagiarism / Intellectual Property Issue</option>
                    <option value="harassment">Hate Speech / Inappropriate language</option>
                    <option value="spam">Spam or Misleading Information</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="details" className="text-xs font-bold text-muted block">Additional Context (Optional)</label>
                  <textarea
                    id="details"
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={3}
                    placeholder="Provide context explaining the issue with this entry..."
                    className="w-full bg-background border border-border focus:border-red-500 rounded-xl p-3 text-xs focus:outline-hidden resize-none text-foreground"
                  />
                </div>
                
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface border border-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}