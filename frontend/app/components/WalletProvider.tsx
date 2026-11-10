"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import {
  connectWallet,
  getConnectedAddress,
  onAccountsChanged,
  signMessage,
  type WalletType,
} from "@/lib/ethers";
import api from "@/lib/api";

interface User {
  walletAddress: string;
  role: string;
}

interface WalletContextValue {
  address: string | null;
  user: User | null;
  token: string | null;
  connecting: boolean;
  error: string | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue>({
  address: null,
  user: null,
  token: null,
  connecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

const STORAGE_KEY = "ardhichain_session";

function loadSession(): { address: string; token: string; user: User } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(address: string, token: string, user: User) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, token, user }));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setAddress(session.address);
      setToken(session.token);
      setUser(session.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${session.token}`;
    }

    // Also check if wallet is still connected (e.g. MetaMask unlocked)
    getConnectedAddress().then((addr: string | null) => {
      if (addr && !session) {
        // Wallet is connected but no session - user needs to sign in
        setAddress(addr);
      }
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    const unsubAccounts = onAccountsChanged((accounts: string[]) => {
      if (accounts.length === 0) {
        // Disconnected from wallet
        setAddress(null);
        setUser(null);
        setToken(null);
        clearSession();
        delete api.defaults.headers.common["Authorization"];
      } else {
        setAddress(accounts[0]);
      }
    });
    return () => {
      unsubAccounts();
    };
  }, []);

  const connect = useCallback(async (type: WalletType) => {
    setConnecting(true);
    setError(null);
    try {
      const provider = await connectWallet(type);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      // Request a login message from the backend
      const { data: msgData } = await api.post("/auth/request-message", {
        walletAddress: addr,
      });
      const message = msgData.message;

      // Sign it with the wallet
      const signature = await signMessage(message);

      // Verify with the backend to get JWT
      const { data: authData } = await api.post("/auth/verify", {
        walletAddress: addr,
        signature,
        message,
      });

      setAddress(addr);
      setToken(authData.token);
      setUser(authData.user);
      api.defaults.headers.common["Authorization"] = `Bearer ${authData.token}`;
      saveSession(addr, authData.token, authData.user);
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? "Failed to connect wallet";
      setError(msg);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setUser(null);
    setToken(null);
    clearSession();
    delete api.defaults.headers.common["Authorization"];
  }, []);

  return (
    <WalletContext.Provider value={{ address, user, token, connecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}
