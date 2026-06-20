"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardLanding() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="p-6 text-xs text-muted animate-pulse">Calling platform data telemetry streams...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hello, {session?.user?.name || "Administrator"} <span className="text-purple-500 font-medium text-xs border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 rounded-sm uppercase tracking-wider ml-1">Admin 👑</span></h1>
          <p className="text-xs text-muted mt-0.5">Platform diagnostic nodes & platform-wide analytics monitoring dashboard.</p>
        </div>
        <Link 
          href="/dashboard/admin/reported-lessons" 
          className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          Moderate Content 🚨
        </Link>
      </div>

      {/* Admin Operations Core Data Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Users</span>
          <div className="text-xl font-black text-foreground mt-2">1,240</div>
          <p className="text-[9px] text-emerald-500 mt-0.5">↑ 12% cycle delta</p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Total Public Lessons</span>
          <div className="text-xl font-black text-foreground mt-2">3,840</div>
          <p className="text-[9px] text-muted/80 mt-0.5">Active catalog entries</p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Reported Content</span>
          <div className="text-xl font-black text-purple-400 mt-2">12</div>
          <p className="text-[9px] text-purple-400/70 mt-0.5">Flagged review items</p>
        </div>
        <div className="p-5 bg-card border border-border/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Today&apos;s New Lessons</span>
          <div className="text-xl font-black text-foreground mt-2">45</div>
          <p className="text-[9px] text-emerald-500 mt-0.5">Incoming user streams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Platform Trajectory Spline Block */}
        <div className="lg:col-span-2 p-6 bg-card border border-border/60 rounded-2xl shadow-xs min-h-80">
          <h3 className="text-xs font-bold text-foreground">Platform Growth Trajectory</h3>
          <p className="text-[10px] text-muted mb-4">Automated continuous spline chart calculation arrays.</p>
          <div className="h-48 w-full bg-surface/40 rounded-xl border border-dashed border-border flex items-center justify-center text-[10px] text-muted">
            [Spline Graph Layer Area - Color Token: #a855f7 (Purple)]
          </div>
        </div>

        {/* Global Overview Feed Mod */}
        <div className="p-6 bg-card border border-border/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-foreground">Recently Added Lessons</h3>
            <Link href="/dashboard/admin/manage-lessons" className="text-[10px] font-bold text-purple-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-surface/50 border border-border/40 rounded-xl text-xs flex justify-between items-start">
              <div>
                <p className="font-semibold text-foreground truncate max-w-35">Designing the Perfect Architecture</p>
                <span className="text-[10px] text-muted block mt-0.5">Yesterday</span>
              </div>
              <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] font-bold rounded-sm uppercase tracking-wide">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}