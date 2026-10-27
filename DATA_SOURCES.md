# Kisse Loon website — data sources

This web app ports the existing Expo mobile demo. Nothing here is a live partner feed.

The public website opens on the homepage with no splash, login wall, or OTP gate.

## Demo (current)

- Food search: only the query `Chicken Biryani` returns restaurants.
- Restaurant menus: one kitchen (`Biryani By Kilo`) cloned onto every result card.
- Grocery catalog, search, results, and product prices.
- Cart totals, platform basket estimates, race/orbit comparison payloads.
- OTP (`9876543210` / `123456`), profile, order history, and notifications.
- Home advertisement banner copy and image.

## Live / configured (none yet)

- Partner checkout URLs are empty. Continue-to-platform shows an unavailable state and keeps the cart.
- No SMS, WhatsApp, or backend auth.
- No ad-network SDK. Ads 1 and 3 are timed placeholders using the existing home banner creative.
- Location uses the browser Geolocation API when the user grants permission; saved addresses are local demo data.

## Connecting a real backend later

Replace implementations behind:

- `src/lib/services/catalogService.ts`
- `src/lib/services/comparisonService.ts`
- `src/lib/services/checkoutService.ts`
- `src/lib/services/adsService.ts`
- `src/lib/services/authService.ts`

Do not invent partner prices or checkout links in page components.
