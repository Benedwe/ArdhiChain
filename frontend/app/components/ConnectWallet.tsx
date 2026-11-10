"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "./WalletProvider";
import { detectAvailableWallets, SUPPORTED_WALLETS, type WalletInfo } from "@/lib/ethers";

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ConnectWallet() {
  const { address, user, connecting, error, connect, disconnect } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [available, setAvailable] = useState<WalletInfo[]>([]);

  useEffect(() => {
    setAvailable(detectAvailableWallets());
  }, []);

  // Connected state - show address dropdown
  if (address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {shortenAddress(address)}
          {user?.role && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {user.role}
            </span>
          )}
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs text-slate-500">Connected</p>
                <p className="truncate text-sm font-medium text-slate-800">{address}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Copy address
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Wallet options to show in modal - detected ones first, then install links for missing ones
  const allWallets = SUPPORTED_WALLETS;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        Connect Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Connect Wallet</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Choose a wallet to sign in to ArdhiChain
            </p>

            {/* Wallet options */}
            <div className="mt-5 space-y-2">
              {allWallets.map((wallet) => {
                const isDetected = available.some((a) => a.type === wallet.type);
                const isGeneric = wallet.type === "injected";

                return (
                  <button
                    key={wallet.type}
                    disabled={connecting}
                    onClick={async () => {
                      await connect(wallet.type);
                      if (!error) setShowModal(false);
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition ${
                      isDetected || isGeneric
                        ? "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                        : "border-slate-100 opacity-50 cursor-pointer hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl">
                      {wallet.icon}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{wallet.name}</p>
                      <p className="text-xs text-slate-500">
                        {isDetected || isGeneric
                          ? wallet.description
                          : `${wallet.name} not detected - click to try anyway`}
                      </p>
                    </div>
                    {isDetected && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Detected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Loading / Error states */}
            {connecting && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting... Please approve the request in your wallet.
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Footer */}
            <p className="mt-5 text-center text-xs text-slate-400">
              By connecting, you agree to sign a message to verify your identity.
              No gas fees required.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
