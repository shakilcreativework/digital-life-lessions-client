"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function UserDashboardLanding() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    // If an admin lands here, push them cleanly to their dedicated admin route
    if (session?.user?.role === "admin") {
      router.push("/dashboard/admin");
    }
  }, [session, router]);

  if (isPending) {
    return <div className="p-6 text-xs text-muted animate-pulse">Synchronizing workspace workspace logs...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hello, {session?.user?.name || "Workspace User"}</h1>
          <p className="text-xs text-muted mt-0.5">Capture insights, review milestones, and manage your logic repository workspace.</p>
        </div>
        <Link 
          href="/dashboard/add-lesson" 
          className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          Write New Lesson ✍️
        </Link>
      </div>

      {/* Analytics Grid Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Lessons Created</span>
          <div className="text-2xl font-black text-primary mt-2">14</div>
          <p className="text-[10px] text-muted/80 mt-1">Your custom insight logs.</p>
        </div>
        <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Saved (Favorites)</span>
          <div className="text-2xl font-black text-amber-500 mt-2">32</div>
          <p className="text-[10px] text-muted/80 mt-1">Bookmarked platform shared items.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Contribution Reflections Chart Canvas Slot */}
        <div className="xl:col-span-2 p-6 bg-card border border-border/60 rounded-2xl shadow-xs min-h-80">
          <h3 className="text-xs font-bold text-foreground">Weekly Contribution Reflections</h3>
          <p className="text-[10px] text-muted mb-4">Automated continuous spline chart calculation arrays.</p>
          <div className="h-48 w-full bg-surface/40 rounded-xl border border-dashed border-border flex items-center justify-center text-[10px] text-muted">
            [Spline Graph Layer Area - Color Token: var(--color-primary)]
          </div>
        </div>

        {/* Recently Added Feed */}
        <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-foreground">Recently Added Lessons</h3>
            <Link href="/dashboard/my-lessons" className="text-[10px] font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-surface/50 border border-border/40 rounded-xl text-xs flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground truncate max-w-35">Embracing Mistakes in Production</p>
                <span className="text-[10px] text-muted block mt-0.5">2 hours ago</span>
              </div>
              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-sm uppercase tracking-wide">Public</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}