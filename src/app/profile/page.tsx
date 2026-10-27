"use client";

import { AuthForm } from "@/components/AuthForm";
import { PlatformLogo } from "@/components/PlatformLogo";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { usePlatforms } from "@/context/PlatformContext";
import { useSession } from "@/context/SessionContext";

export default function ProfilePage() {
  const { user, authenticated, logout } = useSession();
  const { connected, setConnectOpen, disconnectPlatform } = usePlatforms();

  return (
    <SiteShell>
      <PageHeading eyebrow="Account" title="Profile" />
      <div className="stack" style={{ maxWidth: 520 }}>
        <section className="card connected-card">
          <div className="connected-card-head">
            <div>
              <h2>Connected platforms</h2>
              <p className="muted">
                {connected.length} of 6 connected. Two apps unlock compare. Demo OTP 123456.
              </p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setConnectOpen(true)}>
              {connected.length ? "Manage" : "Connect"}
            </button>
          </div>
          {connected.length ? (
            <ul className="connected-list">
              {connected.map((app) => (
                <li key={app.id}>
                  <PlatformLogo platform={app.id} size={36} />
                  <div>
                    <strong>{app.name}</strong>
                    <span>
                      {app.kind} · +91 {app.phone}
                    </span>
                  </div>
                  <button type="button" className="btn btn-ghost" onClick={() => disconnectPlatform(app.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No apps connected yet. Open Connect to add Swiggy, Zomato, Blinkit, and the rest.</p>
          )}
        </section>

        {authenticated ? (
          <div className="card" style={{ padding: 18 }}>
            <h2 style={{ marginTop: 0 }}>{user.name || "Signed in"}</h2>
            <p className="muted">{user.email}</p>
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
