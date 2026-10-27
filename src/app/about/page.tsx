"use client";

import { useState } from "react";
import Link from "next/link";
import { PlatformLogo } from "@/components/PlatformLogo";
import { SiteShell } from "@/components/SiteShell";
import { FOOD_COMPARE_DEMO, GROCERY_COMPARE_DEMO } from "@/lib/site";

const BEATS = [
  {
    id: "habit",
    n: "01",
    title: "The habit",
    text: "Dinner, milk, late-night snacks — people already open more than one delivery app. The totals never sit still.",
  },
  {
    id: "pause",
    n: "02",
    title: "The stall",
    text: "Same dish. Different fees. You still don’t know which one to tap. That second of doubt is the whole product.",
  },
  {
    id: "name",
    n: "03",
    title: "The name",
    text: "Kisse loon means “which one should I take?” We did not start another marketplace. We named the pause and built a comparison layer around it.",
  },
] as const;

const YEARS = [
  {
    mark: "Always",
    title: "The comparison already happened",
    text: "In people’s heads, between three open apps. We did not invent that habit.",
  },
  {
    mark: "The name",
    title: "The question became the company",
    text: "Kisse Loon is that sentence, turned into a place to line up food and grocery prices.",
  },
  {
    mark: "2026",
    title: "This layer ships",
    text: "This website. Six delivery apps. Two categories. Demo prices labeled. You leave to order.",
  },
] as const;

const WORK = {
  food: {
    title: "Food",
    text: "One restaurant across Swiggy, Zomato, and Toing. Demo totals sit next to each other. The cheaper app wins the race.",
    image: "/assets/home/food-mode.jpg",
    alt: "Butter chicken",
    href: "/food",
    lanes: FOOD_COMPARE_DEMO,
    item: "Chicken Biryani",
  },
  grocery: {
    title: "Grocery",
    text: "Everyday packs across Blinkit, Zepto, and Instamart. Same item, labeled demo prices, then you open the app that costs less.",
    image: "/assets/home/grocery-mode.jpg",
    alt: "Milk, grain, and oil",
    href: "/grocery",
    lanes: GROCERY_COMPARE_DEMO,
    item: "Amul Gold Milk",
  },
} as const;

const NOTS = [
  { title: "Not a marketplace", text: "We do not take the order or the payment. The delivery app that wins still does that." },
  { title: "Not live partner prices", text: "Catalogs here are demo comparison data, and they are labeled. Nothing pretends to be a live Swiggy or Blinkit feed." },
  { title: "Not another login wall", text: "Connecting an app uses demo OTP 123456. It is not partner OAuth." },
] as const;

const BELIEFS = [
  { n: "01", title: "Name the pause", text: "If you have to guess, we have not done the job." },
  { n: "02", title: "Line up the totals", text: "Same item, several apps, one screen." },
  { n: "03", title: "Label the demo", text: "If a price is sample data, it says so." },
  { n: "04", title: "Hand you back", text: "Compare here. Order there." },
] as const;

export default function AboutPage() {
  const [beat, setBeat] = useState<(typeof BEATS)[number]["id"]>("habit");
  const [work, setWork] = useState<keyof typeof WORK>("food");
  const activeBeat = BEATS.find((item) => item.id === beat) || BEATS[0];
  const activeWork = WORK[work];

  return (
    <SiteShell wide>
      <article className="about-page">
        <section className="about-ask">
          <div className="about-ask-copy">
            <p className="page-eyebrow">About us</p>
            <p className="about-say">People already ask it.</p>
            <h1 className="about-ask-title">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/brand/kisse-loon-wordmark.png" alt="Kisse Loon?" />
              <span aria-hidden="true">?</span>
            </h1>
            <p className="about-translate">Which one should I take?</p>
            <p className="about-lead">
              That question, asked over food and grocery delivery, is the company. We line up prices across apps. You
              order on the cheaper one.
            </p>
          </div>
          <div className="about-splash" aria-hidden="true">
            <video src="/assets/splash/intro.mp4" autoPlay muted loop playsInline preload="auto" />
          </div>
        </section>

        <ul className="about-meaning">
          <li>
            <strong>Kisse</strong>
            <span>Which one</span>
          </li>
          <li>
            <strong>Loon</strong>
            <span>Should I take</span>
          </li>
          <li>
            <strong>?</strong>
            <span>The pause before order</span>
          </li>
        </ul>

        <section className="about-block" aria-labelledby="story-title">
          <div className="news-block-head">
            <h2 id="story-title">How we started</h2>
            <p>Not with a warehouse. With a sentence people already say out loud.</p>
          </div>
          <div className="about-story">
            <div className="about-beats" role="tablist" aria-label="Origin">
              {BEATS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={beat === item.id}
                  className={beat === item.id ? "active" : ""}
                  onClick={() => setBeat(item.id)}
                >
                  <span>{item.n}</span>
                  <strong>{item.title}</strong>
                  {beat === item.id ? <p>{item.text}</p> : null}
                </button>
              ))}
            </div>
            <div className="about-story-panel">
              {activeBeat.id === "habit" ? (
                <div className="about-logo-cloud" aria-hidden="true">
                  {[...FOOD_COMPARE_DEMO, ...GROCERY_COMPARE_DEMO].map((item) => (
                    <span key={item.id}>
                      <PlatformLogo platform={item.id} size={48} />
                      {item.name}
                    </span>
                  ))}
                </div>
              ) : null}
              {activeBeat.id === "pause" ? (
                <div className="about-price-stack" aria-hidden="true">
                  {FOOD_COMPARE_DEMO.map((item) => (
                    <div key={item.id} className={item.best ? "best" : ""}>
                      <PlatformLogo platform={item.id} size={32} />
                      <em>{item.name}</em>
                      <b>₹{item.price}</b>
                    </div>
                  ))}
                  <p>Demo prices · same biryani</p>
                </div>
              ) : null}
              {activeBeat.id === "name" ? (
                <div className="about-name-card">
                  <p>The company is the question.</p>
                  <h3>
                    Compare first.
                    <span>Order there.</span>
                  </h3>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="about-block" aria-labelledby="when-title">
          <div className="news-block-head">
            <h2 id="when-title">When</h2>
            <p>The habit is older than we are. This comparison layer is from 2026.</p>
          </div>
          <ol className="about-years">
            {YEARS.map((item) => (
              <li key={item.mark}>
                <span>{item.mark}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-block" aria-labelledby="do-title">
          <div className="news-block-head">
            <h2 id="do-title">What we do</h2>
            <p>Two categories. Six apps. Then you leave.</p>
          </div>
          <div className="about-work">
            <div className="about-work-copy">
              <div className="about-work-tabs" role="tablist" aria-label="What we compare">
                {(Object.keys(WORK) as Array<keyof typeof WORK>).map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={work === id}
                    className={work === id ? "active" : ""}
                    onClick={() => setWork(id)}
                  >
                    {WORK[id].title}
                  </button>
                ))}
              </div>
              <h3>{activeWork.title}</h3>
              <p>{activeWork.text}</p>
              <div className="about-work-lanes">
                {activeWork.lanes.map((lane) => (
                  <div key={lane.id} className={lane.best ? "best" : ""}>
                    <PlatformLogo platform={lane.id} size={28} />
                    <span>{lane.name}</span>
                    <b>₹{lane.price}</b>
                  </div>
                ))}
              </div>
              <p className="muted">
                Sample {activeWork.item}. Demo prices, labeled as such.
              </p>
              <Link href={activeWork.href} className="btn btn-primary">
                Compare {activeWork.title.toLowerCase()}
              </Link>
            </div>
            <div className="about-work-visual">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeWork.image} alt={activeWork.alt} />
            </div>
          </div>
        </section>

        <section className="about-block" aria-labelledby="not-title">
          <div className="news-block-head">
            <h2 id="not-title">What we are not</h2>
            <p>Clearer than a slogan. These are the edges of the product.</p>
          </div>
          <div className="about-not">
            {NOTS.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-block" aria-labelledby="belief-title">
          <div className="news-block-head">
            <h2 id="belief-title">How we work</h2>
            <p>Four rules. Features live on the features page.</p>
          </div>
          <ul className="about-beliefs">
            {BELIEFS.map((item) => (
              <li key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-close">
          <div>
            <h2>Still asking kisse loon?</h2>
            <p>Connect two apps, search a dish or a pack, pick the winner.</p>
          </div>
          <div className="about-close-actions">
            <Link href="/" className="btn btn-primary">
              Go compare
            </Link>
            <Link href="/features" className="btn btn-navy">
              See features
            </Link>
            <Link href="/careers" className="btn btn-ghost">
              Careers
            </Link>
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
