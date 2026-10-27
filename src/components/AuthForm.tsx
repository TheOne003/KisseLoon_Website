"use client";

import { FormEvent, useState } from "react";
import { useSession } from "@/context/SessionContext";

export function AuthForm({ compact = false }: { compact?: boolean }) {
  const { loginWithEmail, registerAccount } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result =
      mode === "login" ? loginWithEmail(email, password) : registerAccount(name, email, password);
    if (result) {
      setError(result);
      return;
    }
    setError("");
    setPassword("");
  };

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    setError("");
    setPassword("");
  };

  return (
    <form className={compact ? "profile-login" : "form-card auth-card"} onSubmit={submit}>
      <div className="auth-tabs" role="tablist" aria-label="Account">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={mode === "login" ? "active" : ""}
          onClick={() => switchMode("login")}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={mode === "register" ? "active" : ""}
          onClick={() => switchMode("register")}
        >
          Register
        </button>
      </div>
      {mode === "register" ? (
        <>
          <label className={compact ? "sr-only" : undefined} htmlFor={compact ? "profile-name" : "login-name"}>
            Name
          </label>
          <input
            id={compact ? "profile-name" : "login-name"}
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError("");
            }}
          />
        </>
      ) : null}
      <label className={compact ? "sr-only" : undefined} htmlFor={compact ? "profile-email" : "login-email"}>
        Email
      </label>
      <input
        id={compact ? "profile-email" : "login-email"}
        type="email"
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setError("");
        }}
      />
      <label className={compact ? "sr-only" : undefined} htmlFor={compact ? "profile-password" : "login-password"}>
        Password
      </label>
      <input
        id={compact ? "profile-password" : "login-password"}
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        placeholder={mode === "register" ? "Password (6+ characters)" : "Password"}
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setError("");
        }}
      />
      {error ? <p className="error-text">{error}</p> : null}
      {mode === "register" ? <p className="auth-note">Saved on this device only.</p> : null}
      <button type="submit" className="btn btn-primary btn-block">
        {mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}
