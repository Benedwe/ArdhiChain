import { ethers } from "ethers";

/* ------------------------------------------------------------------ */
/*  Wallet provider types                                           */
/* ------------------------------------------------------------------ */
export type WalletType = "metamask" | "coinbase" | "brave" | "injected";

export interface WalletInfo {
  type: WalletType;
  name: string;
  icon: string;
  description: string;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    type: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using MetaMask browser extension",
  },
  {
    type: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Connect using Coinbase Wallet",
  },
  {
    type: "brave",
    name: "Brave Wallet",
    icon: "🦁",
    description: "Connect using built-in Brave wallet",
  },
  {
    type: "injected",
    name: "Other Wallet",
    icon: "🔗",
    description: "Connect using any EIP-1193 compatible wallet",
  },
];

/* ------------------------------------------------------------------ */
/*  Provider detection helpers                                        */
/* ------------------------------------------------------------------ */
interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isBraveWallet?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, cb: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, cb: (...args: unknown[]) => void) => void;
}

function getProviders(): EthereumProvider[] {
  const eth = window.ethereum as EthereumProvider | undefined;
  if (!eth) return [];
  // Some extensions expose multiple providers in an array
  if (eth.providers?.length) return eth.providers;
  return [eth];
}

function pickProvider(type: WalletType): EthereumProvider | null {
  const providers = getProviders();
  if (!providers.length) return null;

  switch (type) {
    case "metamask":
      return providers.find((p) => p.isMetaMask && !p.isBraveWallet) ?? null;
    case "coinbase":
      return providers.find((p) => p.isCoinbaseWallet) ?? null;
    case "brave":
      return providers.find((p) => p.isBraveWallet) ?? null;
    case "injected":
      // Return the first available provider as fallback
      return providers[0] ?? null;
    default:
      return null;
  }
}

/**
 * Detect which wallets are available in the user's browser.
 */
export function detectAvailableWallets(): WalletInfo[] {
  const providers = getProviders();
  if (!providers.length) return [];

  const available: WalletInfo[] = [];
  const hasMetaMask = providers.some((p) => p.isMetaMask && !p.isBraveWallet);
  const hasCoinbase = providers.some((p) => p.isCoinbaseWallet);
  const hasBrave = providers.some((p) => p.isBraveWallet);

  if (hasMetaMask) available.push(SUPPORTED_WALLETS.find((w) => w.type === "metamask")!);
  if (hasCoinbase) available.push(SUPPORTED_WALLETS.find((w) => w.type === "coinbase")!);
  if (hasBrave) available.push(SUPPORTED_WALLETS.find((w) => w.type === "brave")!);

  // Always show "Other Wallet" as a generic fallback
  available.push(SUPPORTED_WALLETS.find((w) => w.type === "injected")!);
  return available;
}

/* ------------------------------------------------------------------ */
/*  Connection functions                                              */
/* ------------------------------------------------------------------ */

/**
 * Connect to a specific wallet type. Returns the ethers BrowserProvider.
 */
export async function connectWallet(type: WalletType): Promise<ethers.BrowserProvider> {
  const provider = pickProvider(type);
  if (!provider) {
    const info = SUPPORTED_WALLETS.find((w) => w.type === type);
    throw new Error(
      `${info?.name ?? "Wallet"} is not installed. Please install the extension and try again.`
    );
  }

  // Request account access
  await provider.request({ method: "eth_requestAccounts" });

  const ethersProvider = new ethers.BrowserProvider(provider as any);
  return ethersProvider;
}

/**
 * Get the currently connected signer (assumes wallet already connected).
 */
export async function getSigner(): Promise<ethers.Signer> {
  if (!window.ethereum) throw new Error("No wallet connected");
  const provider = new ethers.BrowserProvider(window.ethereum as any);
  return provider.getSigner();
}

/**
 * Get the current connected address, or null if not connected.
 */
export async function getConnectedAddress(): Promise<string | null> {
  if (!window.ethereum) return null;
  try {
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const accounts = (await provider.send("eth_accounts", [])) as string[];
    return accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
}

/**
 * Sign a message using the connected wallet.
 */
export async function signMessage(message: string): Promise<string> {
  const signer = await getSigner();
  return signer.signMessage(message);
}

/**
 * Subscribe to account/chain changes.
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  const eth = window.ethereum as EthereumProvider | undefined;
  if (!eth?.on) return () => {};
  const handler = (...args: unknown[]) => callback(args[0] as string[]);
  eth.on("accountsChanged", handler);
  return () => eth.removeListener?.("accountsChanged", handler);
}

export function onChainChanged(callback: (chainId: string) => void): () => void {
  const eth = window.ethereum as EthereumProvider | undefined;
  if (!eth?.on) return () => {};
  const handler = (...args: unknown[]) => callback(args[0] as string);
  eth.on("chainChanged", handler);
  return () => eth.removeListener?.("chainChanged", handler);
}
