import Image from "next/image";
import { FiFolder, FiEye, FiUnlock, FiHeart, FiMessageSquare } from "react-icons/fi";

export default function LessonsDisplayList({ lessons = [] }) {
    if (lessons.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-surface/30">
                <p className="text-sm font-medium text-muted-foreground">No insight records found inside your collections.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
            {lessons.map((lesson) => (
                <article 
                    key={lesson._id} 
                    className="group relative flex flex-col justify-between overflow-hidden bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all duration-200 shadow-xs hover:shadow-md"
                >
                    <div className="space-y-4">
                        
                        {/* 1. New Author Profile Header Block */}
                        <div className="flex items-center gap-3">
                            {lesson.authorImg ? (
                                <Image 
                                width={100}
                                height={100}
                                priority
                                    src={lesson?.authorImg} 
                                    alt={`${lesson?.authorName || "User"}'s profile avatar`} 
                                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border"
                                    referrerPolicy="no-referrer" // Prevents Google avatar blocking errors
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                    {(lesson?.authorName || "A").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h4 className="text-xs font-bold text-foreground tracking-tight">
                                    {lesson.authorName || "Anonymous Creator"}
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                    {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : "Recent Draft"}
                                </p>
                            </div>
                        </div>

                        {/* 2. Visual Banner Image Pipeline Container */}
                        {lesson?.image && (
                            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-muted">
                                <Image
                                    width={400}
                                    height={400}
                                    src={lesson.image} 
                                    alt={`Banner for ${lesson.title}`}
                                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                                    loading="lazy"
                                />
                            </div>
                        )}

                        {/* 3. Operational Category & Tone Badges */}
                        <div className="flex flex-wrap gap-2 items-center text-[9px] font-black uppercase tracking-wider">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                <FiFolder className="text-xs" /> {lesson.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                {lesson.emotionalTone}
                            </span>
                        </div>

                        {/* 4. Core Text Insight Body */}
                        <div>
                            <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-150">
                                {lesson.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-3 mt-1.5 leading-relaxed">
                                {lesson.description}
                            </p>
                        </div>
                    </div>

                    {/* 5. Dynamic Interactive Footer (Likes, Comments & Protection Status) */}
                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                        
                        {/* Metrics Data Stack */}
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 hover:text-red-500 transition-colors duration-150 cursor-pointer">
                                <FiHeart className="text-sm text-muted-foreground/80" /> 
                                <span>{lesson.likesCount || 0}</span>
                            </span>
                            <span className="flex items-center gap-1 hover:text-primary transition-colors duration-150 cursor-pointer">
                                <FiMessageSquare className="text-sm text-muted-foreground/80" /> 
                                <span>{lesson.CommentsCount || 0}</span>
                            </span>
                        </div>

                        {/* Protection State Scope */}
                        <div className="flex items-center gap-2.5 text-[10px] bg-surface px-2 py-0.5 rounded-md border border-border/40">
                            <span className="flex items-center gap-1"><FiEye /> {lesson.visibility}</span>
                            <span className="text-muted/40">|</span>
                            <span className="flex items-center gap-1"><FiUnlock /> {lesson.accessLevel}</span>
                        </div>
                    </div>

                </article>
            ))}
        </div>
    );
}