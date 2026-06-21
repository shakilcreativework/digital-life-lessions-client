"use client";


import { useRouter } from "next/navigation";
import BaseButton from "./BaseButton"; 
import { MdOutlineLibraryBooks } from "react-icons/md";

const EmptyState = () => {
  const router = useRouter();

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-100 rounded-2xl border border-dashed border-border bg-card/30 backdrop-blur-xs max-w-md mx-auto animate-fade-in"
    >
      {/* Static Visual Icon Asset */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 mb-5 ring-4 ring-purple-500/5">
        <MdOutlineLibraryBooks className="w-8 h-8" />
      </div>

      {/* Hardcoded Static Content Blocks */}
      <div className="space-y-2 mb-6">
        <h3 className="text-lg font-bold text-foreground tracking-tight">
          No Lessons Available
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          It looks like there aren&apos;t any lessons published in this space right now.
        </p>
      </div>

      {/* Static Navigation Button Link */}
      <BaseButton
        animated
        onClick={() => router.push("/dashboard/add-lesson")}
        text="Create a Lesson"
        className="py-2.5 px-5 text-sm"
      />
    </div>
  );
};

export default EmptyState;