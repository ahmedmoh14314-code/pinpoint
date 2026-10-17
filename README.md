# Pinpoint

A travel map. Click a place on the map and the app saves that city to your list, with the date you went and a note. Cities are also grouped by country. Built to learn React Router's nested routes and `useReducer` properly.

React 18 · React Router 6 · Context + `useReducer` · Leaflet · CSS Modules · Vite

![The app with the map and the saved cities](docs/app.jpg)

## Live demo

There is no hosted version: the cities come from a local `json-server` API, so the app runs on your machine. The steps are at the bottom and take about a minute. The login form is pre-filled with the fake account from `FakeAuthContext.jsx`.

## What this project demonstrates

- **Nested routes with a persistent layout.** `/app` renders `AppLayout` with the sidebar and the map; `cities`, `cities/:id`, `countries` and `form` render into an `<Outlet />` in the sidebar, so the map keeps its zoom and position while you move between them. An `index` route redirects `/app` to `/app/cities`.
- **A protected route.** `ProtectedRoute` reads `isAuthenticated` from Context and sends you to the homepage in an effect, returning `null` meanwhile so nothing flashes.
- **State in the URL.** The map position lives in search params (`/app/form?lat=…&lng=…`). The `useUrlPosition` hook reads it, so the form and the map agree without passing props, and a link can be shared.
- **`useReducer` for state that changes together.** `CitiesContext` keeps `cities`, `loading`, `currentCity` and `error` in one reducer. The reducer is pure; the `fetch` calls live in the provider and only dispatch results.
- **Two contexts, not one.** Cities and auth change at different times, so they are separate providers and logging in does not re-render the city list.
- **Custom hooks with one job.** `useUrlPosition` and `useGeolocation`, which wraps the browser geolocation API with loading and error state.
- **Code splitting.** Every page is `lazy()` behind one `Suspense`. Leaflet is the biggest dependency, and someone who only opens the landing page should not download it. The build went from one 522 kB file to a 363 kB shell plus a 157 kB `AppLayout` chunk loaded only on `/app`.
- **Data fetching with error states.** A reverse-geocoding call fills the city and country from the clicked coordinates, with a message when the click is not on a city.
- **Styling without a framework.** CSS Modules per component, design tokens in `index.css`.

## Key decisions

- **`useReducer` instead of `useState`.** Every action touches more than one value: a fetch sets `loading`, then sets `loading` back and fills `cities` or `error`. With `useState` that is three or four `set` calls per function; with a reducer each case is one complete change in one file.
- **`useCallback` on `getCity`.** It is a dependency of an effect in `City.jsx`; without memoising it, the effect would run on every render.
- **Navigation through the map.** Clicking the map does not set state; it navigates to `form?lat&lng`. The URL is the single source of the position.

## Where to look

| File | What it shows |
| --- | --- |
| `src/App.jsx` | The route tree, lazy pages, providers |
| `src/contexts/CitiesContext.jsx` | The reducer, the fetches, the `useCallback` |
| `src/components/ProtectedRoute.jsx` | Route protection |
| `src/components/Map.jsx` | Leaflet, `useMapEvents`, geolocation, URL position |
| `src/components/Form.jsx` | Reverse geocoding and the add-city form |
| `src/hooks/` | `useUrlPosition`, `useGeolocation` |

## Screenshots

| Landing page | Login |
| --- | --- |
| ![The Pinpoint landing page](docs/home.jpg) | ![The login screen](docs/login.jpg) |

| One city, with date and notes | Grouped by country |
| --- | --- |
| ![The details of one saved city](docs/city-detail.jpg) | ![Cities grouped by country](docs/countries.jpg) |

## Tech stack

| What | Why |
| --- | --- |
| React 18 | The UI |
| React Router 6 | Pages, nested routes, URL parameters |
| Context + `useReducer` | Shared state for cities and for auth |
| Leaflet + react-leaflet | The map |
| json-server | A fake REST API, so the app talks to a real endpoint |
| CSS Modules | Styles, no framework |
| Vite | Dev server and build |

## Project structure

```
src/
├── App.jsx                the routes
├── components/            CityList, City, CountryList, Form, Map, Sidebar, ProtectedRoute, …
├── contexts/              CitiesContext.jsx (useReducer + fetching), FakeAuthContext.jsx
├── hooks/                 useGeolocation.js, useUrlPosition.js
├── pages/                 AppLayout, Homepage, Login, Pricing, Product, PageNotFound
└── index.css              design tokens, resets
```

## What I learned

When `useReducer` is better than `useState`: when several pieces of state change together, and when the same change is triggered from more than one place.

And dependency arrays. React compares them by identity, so a function written inside a component is a new value on every render. Put one in a dependency array without `useCallback` and the effect runs again and again. Working that out taught me more than the feature itself.

## Running locally

Two terminals, because the data comes from a local API.

```bash
npm install
npm run server   # json-server on http://localhost:9000
npm run dev      # Vite, usually http://localhost:5173
```

Log in with the email and password already filled in the form.

Map data from OpenStreetMap. Photos from Unsplash.
