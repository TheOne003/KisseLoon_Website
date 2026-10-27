"use client";

import { AuthForm } from "@/components/AuthForm";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { usePlatforms } from "@/context/PlatformContext";
import { useSession } from "@/context/SessionContext";

export default function ProfilePage() {
  const { user, authenticated, logout } = useSession();
  const { connected, setConnectOpen } = usePlatforms();

  return (
    <SiteShell>
      <PageHeading eyebrow="Account" title="Profile" />
      <div className="stack" style={{ maxWidth: 480 }}>
        {authenticated ? (
          <div className="card" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>{user.name || "Signed in"}</h2>
            <p className="muted">{user.email}</p>
            <button type="button" className="btn btn-navy" onClick={() => setConnectOpen(true)}>
              Connected platforms · {connected.length}
            </button>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
        ) : (
          <AuthForm />
        )}
      </div>
    </SiteShell>
  );
}
