import "./styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Metadata } from "next";
import Link from "next/link";
import { WalletProvider } from "./components/WalletProvider";
import ConnectWallet from "./components/ConnectWallet";
import MobileNav from "./components/MobileNav";

export const metadata: Metadata = {
  title: "ArdhiChain Tanzania",
  description: "Blockchain land governance platform for Tanzania"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <WalletProvider>
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="text-base font-bold text-slate-900">ArdhiChain</span>
              </Link>

              <nav className="hidden items-center gap-1 md:flex">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/land-registry", label: "Registry" },
                  { href: "/gis", label: "GIS" },
                  { href: "/governance", label: "Governance" },
                  { href: "/marketplace", label: "Market" },
                  { href: "/verification", label: "Verify" },
                  { href: "/disputes", label: "Disputes" },
                  { href: "/admin", label: "Admin" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <ConnectWallet />
                <MobileNav />
              </div>
            </div>
          </header>
          <main className="pb-8">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
