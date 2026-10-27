"use client";

import { FormEvent, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { SocialIcon } from "@/components/SocialIcon";
import { SOCIALS } from "@/lib/site";
import { readJson, storageKeys, writeJson } from "@/lib/storage";

const TOPICS = ["Food compare", "Grocery compare", "Connecting apps", "Account", "Other"] as const;

const FAQS = [
  {
    q: "How does Kisse Loon work?",
    a: "Search a dish or a grocery pack, see labeled demo prices across delivery apps, then continue on the app that costs less.",
  },
  {
    q: "Why do I need two platforms connected?",
    a: "Compare stays locked until two apps are connected. One app is not a comparison.",
  },
  {
    q: "Is the OTP a real login?",
    a: "No. Connecting an app uses demo OTP 123456. It is not partner OAuth or a live Swiggy, Zomato, or grocery login.",
  },
  {
    q: "Are these live prices?",
    a: "No. Food and grocery totals on this site are demo comparison data and are labeled as such.",
  },
  {
    q: "Where do I place the order?",
    a: "On the delivery app that wins. Kisse Loon is a comparison layer, not a marketplace, and it does not take payment.",
  },
  {
    q: "How do I reach you?",
    a: "Use the form on this page or the official Instagram, LinkedIn, and X icons. A live support inbox is not connected in this demo.",
  },
] as const;

type ContactMessage = {
  name: string;
  email: string;
  topic: string;
  message: string;
  at: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("Food compare");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0].q);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();
    if (!trimmedName) {
      setError("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Enter a valid email.");
      return;
    }
    if (trimmedMessage.length < 10) {
      setError("Write a short message so we know how to help.");
      return;
    }
    const next: ContactMessage = {
      name: trimmedName,
      email: trimmedEmail,
      topic,
      message: trimmedMessage,
      at: new Date().toISOString(),
    };
    const existing = readJson<ContactMessage[]>(storageKeys.contact, []);
    writeJson(storageKeys.contact, [next, ...existing].slice(0, 20));
    setError("");
    setSent(true);
  };

  return (
    <SiteShell wide>
      <section className="contact-page">
        <header className="story-head">
          <p className="page-eyebrow">Contact</p>
          <h1>Tell us what you need.</h1>
          <p className="muted">Questions about compare, connecting apps, or this demo site.</p>
        </header>

        <div className="contact-layout">
          {sent ? (
            <div className="contact-form contact-sent">
              <p className="page-eyebrow">Sent</p>
              <h2>Message saved on this device.</h2>
              <p className="muted">
                A live inbox is not connected in this demo. For a public reply, use the official social icons.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSent(false);
                  setMessage("");
                }}
              >
                Write another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                className="field"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
              />
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                className="field"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
              />
              <p className="contact-label">Topic</p>
              <div className="contact-topics" role="group" aria-label="Topic">
                {TOPICS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={topic === item ? "chip active" : "chip"}
                    onClick={() => setTopic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                className="field"
                rows={5}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError("");
                }}
              />
              {error ? <p className="error-text">{error}</p> : null}
              <p className="muted">This demo stores the note on this browser. It does not email a support inbox.</p>
              <button type="submit" className="btn btn-primary btn-block">
                Send message
              </button>
            </form>
          )}

          <aside className="contact-aside">
            <h2>Reach us on</h2>
            <p className="muted">Official handles. Same links as the footer.</p>
            <div className="contact-socials">
              {SOCIALS.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" aria-label={social.name}>
                  <SocialIcon name={social.name} size={20} />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
            <ul className="contact-points">
              <li>Demo OTP is 123456.</li>
              <li>Prices shown here are labeled demo data.</li>
              <li>Orders complete on the delivery app that wins.</li>
            </ul>
          </aside>
        </div>

        <section className="contact-faqs" aria-labelledby="faq-title">
          <div className="news-block-head">
            <h2 id="faq-title">FAQs</h2>
            <p>The short answers before you write in.</p>
          </div>
          <div className="faq-list">
            {FAQS.map((faq) => {
              const open = openFaq === faq.q;
              return (
                <div key={faq.q} className={open ? "faq-item open" : "faq-item"}>
                  <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : faq.q)}>
                    <span>{faq.q}</span>
                    <em>{open ? "–" : "+"}</em>
                  </button>
                  {open ? <p>{faq.a}</p> : null}
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </SiteShell>
  );
}
