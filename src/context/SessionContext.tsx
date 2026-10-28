"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SAVED_ADDRESSES } from "@/lib/data/account";
import { formatProfilePhone } from "@/lib/data/auth";
import { storageKeys, readJson, writeJson, removeKey } from "@/lib/storage";
import type { SavedAddress, SessionUser } from "@/lib/types";

const DEFAULT_USER: SessionUser = {
  phone: "",
  name: "",
  email: "",
  initials: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type StoredAccount = {
  email: string;
  name: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function initialsFrom(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts[0] && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return (email.split("@")[0] || "U").slice(0, 2).toUpperCase();
}

function userFromAccount(account: StoredAccount, prev: SessionUser = DEFAULT_USER): SessionUser {
  return {
    ...prev,
    email: account.email,
    name: account.name,
    initials: initialsFrom(account.name, account.email),
  };
}

function readAccounts(): StoredAccount[] {
  const raw = readJson<Array<{ email?: string; name?: string }>>(storageKeys.accounts, []);
  return raw
    .filter((item) => item.email)
    .map((item) => ({ email: normalizeEmail(item.email || ""), name: (item.name || "").trim() }));
}

function writeAccounts(accounts: StoredAccount[]) {
  writeJson(storageKeys.accounts, accounts);
}

function userFromEmail(email: string, prev: SessionUser = DEFAULT_USER): SessionUser {
  const trimmed = normalizeEmail(email);
  const local = trimmed.split("@")[0] || "You";
  const pretty = local.replace(/[._-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const initials = local.slice(0, 2).toUpperCase();
  return { ...prev, email: trimmed, name: prev.name || pretty, initials };
}

interface SessionState {
  ready: boolean;
  authenticated: boolean;
  user: SessionUser;
  location: string;
  addresses: SavedAddress[];
  phoneDigits: string;
  formattedPhone: string;
  login: (phone: string) => void;
  hasEmailAccount: (email: string) => boolean;
  loginWithEmail: (email: string) => string | null;
  registerAccount: (name: string, email: string) => string | null;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<SessionUser, "name" | "email">>) => void;
  setLocation: (value: string) => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<SessionUser>(DEFAULT_USER);
  const [authenticated, setAuthenticated] = useState(false);
  const [location, setLocationState] = useState("Ghaziabad");
  const [addresses, setAddresses] = useState<SavedAddress[]>(SAVED_ADDRESSES);

  const signIn = useCallback((next: SessionUser) => {
    writeJson(storageKeys.session, { email: next.email, phone: next.phone });
    writeJson(storageKeys.profile, next);
    setUser(next);
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    const session = readJson<{ email?: string; phone?: string } | null>(storageKeys.session, null);
    const profile = readJson<SessionUser | null>(storageKeys.profile, null);
    const savedLocation = readJson<string | null>(storageKeys.location, null);
    if (session?.email) {
      const account = readAccounts().find((item) => item.email === normalizeEmail(session.email || ""));
      setAuthenticated(true);
      setUser(
        account
          ? userFromAccount(account, { ...(profile || DEFAULT_USER), phone: session.phone || profile?.phone || "" })
          : userFromEmail(session.email, { ...(profile || DEFAULT_USER), phone: session.phone || profile?.phone || "" }),
      );
    } else if (session?.phone) {
      setAuthenticated(true);
      setUser({
        ...(profile || DEFAULT_USER),
        phone: session.phone,
        initials: profile?.initials || "U",
      });
    } else if (profile) {
      setUser({ ...DEFAULT_USER, ...profile, phone: "" });
    }
    if (savedLocation) setLocationState(savedLocation);
    setReady(true);
  }, []);

  const login = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, "").slice(-10);
    writeJson(storageKeys.session, { phone: digits });
    setUser((prev) => {
      const next = { ...prev, phone: digits, initials: prev.initials || "U" };
      writeJson(storageKeys.profile, next);
      return next;
    });
    setAuthenticated(true);
  }, []);

  const hasEmailAccount = useCallback((email: string) => {
    const trimmed = normalizeEmail(email);
    return readAccounts().some((item) => item.email === trimmed);
  }, []);

  const loginWithEmail = useCallback((email: string) => {
    const trimmed = normalizeEmail(email);
    if (!EMAIL_RE.test(trimmed)) return "Enter a valid email.";
    const account = readAccounts().find((item) => item.email === trimmed);
    if (!account) return "No account for this email. Register first.";
    signIn(userFromAccount(account));
    return null;
  }, [signIn]);

  const registerAccount = useCallback((name: string, email: string) => {
    const trimmedName = name.trim();
    const trimmed = normalizeEmail(email);
    if (trimmedName.length < 2) return "Enter your name.";
    if (!EMAIL_RE.test(trimmed)) return "Enter a valid email.";
    const accounts = readAccounts();
    if (accounts.some((item) => item.email === trimmed)) return "That email is already registered. Log in.";
    const account: StoredAccount = { email: trimmed, name: trimmedName };
    writeAccounts([...accounts, account]);
    signIn(userFromAccount(account));
    return null;
  }, [signIn]);

  const logout = useCallback(() => {
    removeKey(storageKeys.session);
    setAuthenticated(false);
    setUser(DEFAULT_USER);
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<SessionUser, "name" | "email">>) => {
    setUser((prev) => {
      const name = patch.name ?? prev.name;
      const next = { ...prev, ...patch, name, initials: initialsFrom(name, patch.email ?? prev.email) };
      writeJson(storageKeys.profile, next);
      const email = normalizeEmail(next.email);
      if (email) {
        writeAccounts(
          readAccounts().map((account) =>
            account.email === email ? { ...account, name: next.name, email } : account,
          ),
        );
      }
      return next;
    });
  }, []);

  const setLocation = useCallback((value: string) => {
    setLocationState(value);
    writeJson(storageKeys.location, value);
  }, []);

  const addAddress = useCallback((address: Omit<SavedAddress, "id">) => {
    setAddresses((prev) => [...prev, { ...address, id: `addr-${Date.now()}` }]);
    if (address.city) setLocation(address.city);
  }, [setLocation]);

  const value = useMemo<SessionState>(
    () => ({
      ready,
      authenticated,
      user,
      location,
      addresses,
      phoneDigits: user.phone,
      formattedPhone: formatProfilePhone(user.phone),
      login,
      hasEmailAccount,
      loginWithEmail,
      registerAccount,
      logout,
      updateProfile,
      setLocation,
      addAddress,
    }),
    [
      ready,
      authenticated,
      user,
      location,
      addresses,
      login,
      hasEmailAccount,
      loginWithEmail,
      registerAccount,
      logout,
      updateProfile,
      setLocation,
      addAddress,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
