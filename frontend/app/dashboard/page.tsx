"use client";

import Link from "next/link";
import { useWallet } from "../components/WalletProvider";

const kpis = [
  { title: "Registered Parcels", value: "100", change: "+12 this week", trend: "up", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 9.618l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", color: "emerald" },
  { title: "Active Proposals", value: "20", change: "5 open for voting", trend: "neutral", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z", color: "blue" },
  { title: "Transactions", value: "50", change: "$847K volume", trend: "up", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "violet" },
  { title: "Open Disputes", value: "15", change: "3 need attention", trend: "down", icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "amber" },
];

const recentActivity = [
  { type: "registered", title: "Parcel TZ-PARCEL-0098 registered", time: "2 min ago", user: "0x7a2...f3e1" },
  { type: "verified", title: "Parcel TZ-PARCEL-0085 verified by officer", time: "15 min ago", user: "0x3b1...a9c2" },
  { type: "transferred", title: "Parcel TZ-PARCEL-0042 transferred for 12,500 USDC", time: "1 hr ago", user: "0x9f4...d7b3" },
  { type: "proposal", title: "Proposal #18: Tax policy reform opened for voting", time: "3 hrs ago", user: "0x1c8...e5a4" },
  { type: "dispute", title: "Dispute D-012 filed for parcel TZ-PARCEL-0025", time: "5 hrs ago", user: "0x4d2...b8f6" },
  { type: "resolved", title: "Dispute D-009 resolved in favor of claimant", time: "8 hrs ago", user: "0x6e7...c1d9" },
];

const quickActions = [
  { label: "Register Land", href: "/land-registry", icon: "M12 4v16m8-8H4", color: "emerald" },
  { label: "New Proposal", href: "/governance", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: "blue" },
  { label: "Browse Market", href: "/marketplace", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z", color: "violet" },
  { label: "View Map", href: "/gis", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 9.618l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7", color: "amber" },
];

function activityIcon(type: string) {
  const map: Record<string, { bg: string; dot: string }> = {
    registered: { bg: "bg-emerald-50", dot: "bg-emerald-500" },
    verified: { bg: "bg-blue-50", dot: "bg-blue-500" },
    transferred: { bg: "bg-violet-50", dot: "bg-violet-500" },
    proposal: { bg: "bg-indigo-50", dot: "bg-indigo-500" },
    dispute: { bg: "bg-amber-50", dot: "bg-amber-500" },
    resolved: { bg: "bg-emerald-50", dot: "bg-emerald-500" },
  };
  return map[type] ?? { bg: "bg-slate-50", dot: "bg-slate-400" };
}

export default function DashboardPage() {
  const { address, user } = useWallet();

  const colorMap: Record<string, { ring: string; text: string; bg: string }> = {
    emerald: { ring: "ring-emerald-100", text: "text-emerald-600", bg: "bg-emerald-50" },
    blue: { ring: "ring-blue-100", text: "text-blue-600", bg: "bg-blue-50" },
    violet: { ring: "ring-violet-100", text: "text-violet-600", bg: "bg-violet-50" },
    amber: { ring: "ring-amber-100", text: "text-amber-600", bg: "bg-amber-50" },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="badge badge-emerald mb-3"><span className="dot dot-emerald" /> Dashboard</div>
          <h1 className="text-3xl font-bold text-slate-900">
            {address ? `Welcome back` : "Operational Command Center"}
          </h1>
          {user && (
            <p className="mt-1 text-sm text-slate-500">
              Role: <span className="font-medium text-slate-700">{user.role}</span>
              {" "}&middot;{" "}
              <span className="font-mono text-xs">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
            </p>
          )}
        </div>
        <Link href="/admin" className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Admin Portal
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const c = colorMap[kpi.color];
          return (
            <div key={kpi.title} className={`card card-interactive animate-fade-in-up animate-delay-${(i + 1) * 100} p-6`}>
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ring-1 ${c.ring}`}>
                  <svg className={`h-5 w-5 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={kpi.icon} /></svg>
                </div>
                <span className={`badge ${kpi.trend === "up" ? "badge-emerald" : kpi.trend === "down" ? "badge-amber" : "badge-slate"}`}>
                  {kpi.trend === "up" ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  ) : kpi.trend === "down" ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  ) : null}
                  {kpi.change}
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-sm text-slate-500">{kpi.title}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Activity Feed */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button className="btn-ghost text-xs">View all</button>
          </div>
          <div className="mt-4 space-y-1">
            {recentActivity.map((activity, i) => {
              const style = activityIcon(activity.type);
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50">
                  <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono">{activity.user}</span>
                      <span>&middot;</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const c = colorMap[action.color];
                return (
                  <Link key={action.label} href={action.href} className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 transition-all hover:border-slate-200 hover:shadow-sm">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ring-1 ${c.ring} transition-transform group-hover:scale-110`}>
                      <svg className={`h-5 w-5 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={action.icon} /></svg>
                    </div>
                    <span className="text-xs font-medium text-slate-700">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Network Status */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Network Status</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Network</span>
                <span className="badge badge-emerald"><span className="dot dot-emerald" /> Avalanche Fuji</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Block Height</span>
                <span className="text-sm font-semibold text-slate-800">24,891,204</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Gas Price</span>
                <span className="text-sm font-semibold text-slate-800">25 nAVAX</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Contracts</span>
                <span className="badge badge-blue">5 deployed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
