"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { useSession } from "@/context/SessionContext";

export default function PersonalInfoPage() {
  const { user, formattedPhone, updateProfile } = useSession();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const router = useRouter();

  return (
    <SiteShell>
      <PageHeading title="Personal information" />
      <div className="narrow">
        <form
          className="form-card stack"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            updateProfile({ name, email });
            router.push("/profile");
          }}
        >
          <label htmlFor="name">Name</label>
          <input id="name" className="field" value={name} onChange={(event) => setName(event.target.value)} />
          <label htmlFor="email">Email</label>
          <input id="email" className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label>Phone</label>
          <input className="field" value={formattedPhone} readOnly />
          <button type="submit" className="btn btn-primary btn-block">
            Save
          </button>
        </form>
      </div>
    </SiteShell>
  );
}
