"use client";

import { useState } from "react";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { OTP_HELP_FAQS } from "@/lib/data/account";

export default function OtpHelpPage() {
  const [open, setOpen] = useState<string | null>(OTP_HELP_FAQS[0].q);
  return (
    <SiteShell>
      <PageHeading title="OTP help" subtitle="This is only for the optional demo account." />
      <div className="stack" style={{ maxWidth: 640 }}>
        {OTP_HELP_FAQS.map((faq) => (
          <button
            key={faq.q}
            type="button"
            className="card"
            style={{ padding: 16, textAlign: "left", border: 0 }}
            onClick={() => setOpen(open === faq.q ? null : faq.q)}
          >
            <strong>{faq.q}</strong>
            {open === faq.q ? <p className="muted">{faq.a}</p> : null}
          </button>
        ))}
        <p className="muted">Contact support is not connected in this demo.</p>
      </div>
    </SiteShell>
  );
}
