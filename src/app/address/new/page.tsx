"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeading, SiteShell } from "@/components/SiteShell";
import { useSession } from "@/context/SessionContext";

export default function AddAddressPage() {
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [state, setState] = useState("");
  const [label, setLabel] = useState("Home");
  const { addAddress } = useSession();
  const router = useRouter();

  return (
    <SiteShell>
      <PageHeading title="Add new address" />
      <div>
        <form
          className="form-card stack"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            addAddress({
              label,
              line: [line, pin, state].filter(Boolean).join(", "),
              city: city || "Ghaziabad",
            });
            router.back();
          }}
        >
          <label htmlFor="line">Address line</label>
          <input id="line" className="field" required value={line} onChange={(event) => setLine(event.target.value)} />
          <label htmlFor="city">City</label>
          <input id="city" className="field" required value={city} onChange={(event) => setCity(event.target.value)} />
          <label htmlFor="pin">PIN</label>
          <input id="pin" className="field" value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} />
          <label htmlFor="state">State</label>
          <input id="state" className="field" value={state} onChange={(event) => setState(event.target.value)} />
          <div className="chip-row">
            {["Home", "Work", "Other"].map((item) => (
              <button key={item} type="button" className={`chip ${label === item ? "active" : ""}`} onClick={() => setLabel(item)}>
                {item}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Save address
          </button>
        </form>
      </div>
    </SiteShell>
  );
}
