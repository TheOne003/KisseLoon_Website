import { SiteShell } from "@/components/SiteShell";
import { SocialIcon } from "@/components/SocialIcon";
import { SOCIALS } from "@/lib/site";

const TALKS = [
  {
    id: "ig-1",
    channel: "Instagram",
    handle: "@kisseloon",
    time: "2d",
    text: "Stopped opening three food apps. Search once, watch the cheaper total win.",
  },
  {
    id: "x-1",
    channel: "X",
    handle: "@kisseloon",
    time: "4d",
    text: "Grocery milk compared on Blinkit, Zepto, Instamart. Demo race. Instamart came in lowest.",
  },
  {
    id: "li-1",
    channel: "LinkedIn",
    handle: "kisse-loon",
    time: "1w",
    text: "A comparison layer, not another marketplace. Connect two apps, then pick where you actually order.",
  },
  {
    id: "ig-2",
    channel: "Instagram",
    handle: "@kisseloon",
    time: "1w",
    text: "Floating cart pops when you add a pack. Header stays clean.",
  },
  {
    id: "x-2",
    channel: "X",
    handle: "@kisseloon",
    time: "2w",
    text: "Two platforms to unlock compare. Demo OTP. Then the race.",
  },
  {
    id: "li-2",
    channel: "LinkedIn",
    handle: "kisse-loon",
    time: "3w",
    text: "Same biryani. Three apps. One better demo price. That is the product.",
  },
] as const;

const REVIEWS = [
  {
    id: "r1",
    name: "Ananya M.",
    city: "Bengaluru",
    stars: 5,
    time: "2 weeks ago",
    text: "Connected Swiggy and Zomato, searched biryani, picked the cheaper total. Clear that prices are demo.",
  },
  {
    id: "r2",
    name: "Rahul K.",
    city: "Pune",
    stars: 5,
    time: "3 weeks ago",
    text: "Grocery compare for Amul Gold is the bit I use. Cart pops at the bottom. No clutter in the header.",
  },
  {
    id: "r3",
    name: "Meera S.",
    city: "Hyderabad",
    stars: 4,
    time: "1 month ago",
    text: "Needs two apps connected first, which is fair. After that the food race is easy to follow.",
  },
  {
    id: "r4",
    name: "Vikram P.",
    city: "Delhi",
    stars: 5,
    time: "1 month ago",
    text: "Not trying to be a delivery app. It compares, then I order on the winner. That is the point.",
  },
] as const;

function Stars({ value }: { value: number }) {
  return (
    <span className="star-row" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "star on" : "star"} />
      ))}
    </span>
  );
}

export default function NewsPage() {
  const average = (REVIEWS.reduce((sum, review) => sum + review.stars, 0) / REVIEWS.length).toFixed(1);

  return (
    <SiteShell wide>
      <section className="news-page">
        <header className="story-head">
          <p className="page-eyebrow">News</p>
          <h1>What people are saying</h1>
          <p className="muted">Official handles, sample community talk, and sample Google-style reviews.</p>
        </header>

        <section className="news-block" aria-labelledby="handles-title">
          <div className="news-block-head">
            <h2 id="handles-title">Social handles</h2>
            <p>Follow the official accounts. These are the same links as the footer.</p>
          </div>
          <div className="handle-grid">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                className="handle-card"
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="handle-icon">
                  <SocialIcon name={social.name} size={22} />
                </span>
                <span>
                  <strong>{social.name}</strong>
                  <em>{social.handle}</em>
                </span>
                <span className="handle-go">Open</span>
              </a>
            ))}
          </div>
        </section>

        <section className="news-block" aria-labelledby="talk-title">
          <div className="news-block-head">
            <h2 id="talk-title">What they talk about</h2>
            <p>Sample posts in the voice of the product. Not a live social feed.</p>
          </div>
          <div className="talk-grid">
            {TALKS.map((post) => (
              <article key={post.id} className="talk-card">
                <header>
                  <SocialIcon name={post.channel} size={16} />
                  <strong>{post.handle}</strong>
                  <span>{post.time}</span>
                </header>
                <p>{post.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="news-block" aria-labelledby="reviews-title">
          <div className="news-block-head">
            <h2 id="reviews-title">Google reviews</h2>
            <p>Sample Google-style reviews for this demo website — not live ratings from Google.</p>
          </div>
          <div className="review-board">
            <aside className="review-score">
              <p className="review-score-kicker">Sample rating</p>
              <p className="review-score-value">{average}</p>
              <Stars value={5} />
              <p className="muted">{REVIEWS.length} sample reviews</p>
            </aside>
            <div className="review-list">
              {REVIEWS.map((review) => (
                <article key={review.id} className="review-card">
                  <header>
                    <span className="review-avatar" aria-hidden="true">
                      {review.name[0]}
                    </span>
                    <div>
                      <strong>{review.name}</strong>
                      <span>
                        {review.city} · {review.time}
                      </span>
                    </div>
                  </header>
                  <Stars value={review.stars} />
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </SiteShell>
  );
}
