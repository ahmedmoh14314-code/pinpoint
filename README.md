# Pinpoint

Pinpoint is a travel app. You click a place on a world map, and the app saves
that city to your list. You can add the date you went there and a short note.
Cities are also grouped by country, so you can see every country you have
visited.

![The app with the map and the saved cities](docs/app.jpg)

This is a demo app. It runs on a local fake API, so there is no hosted link.
The instructions below start it in about one minute.

---

## What it does

- Click anywhere on the map to add a city
- The app reads the coordinates and fills in the city and country for you
- Save a date and your own notes for each city
- See all your cities in a list, or grouped by country
- Delete a city from the list
- Click "Use your position" to jump the map to where you are
- Log in and log out (fake auth, see the note below)

---

## How to run it

You need Node.js. The app needs two terminals, because the data comes from a
local API.

```bash
npm install
```

**Terminal 1** — the fake API:

```bash
npm run server
```

**Terminal 2** — the app:

```bash
npm run dev
```

Open the address that Vite prints, usually `http://localhost:5173`.

To log in, use the email and password that are already filled in the form.

---

## Tech stack

| What | Why |
| --- | --- |
| React 18 | The whole UI |
| React Router 6 | Pages, nested routes, URL parameters |
| Context + `useReducer` | Shared state for cities and for auth |
| Leaflet | The map |
| json-server | A fake REST API, so the app talks to a real endpoint |
| CSS Modules | Styles, with no CSS framework |
| Vite | Dev server and build |

---

## How the state works

This is the part I spent the most time on, so I want to explain it properly.

### Why `useReducer` and not `useState`

The cities data has four values that always change together:

```js
const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};
```

Every action touches more than one of them at the same time. When a fetch
starts, `loading` becomes `true`. When it finishes, `loading` goes back to
`false` **and** `cities` gets the new data. When it fails, `loading` goes back
to `false` **and** `error` gets a message.

With `useState` this would be three or four `set` calls in a row, in every
function, and it is easy to forget one. With `useReducer` each case describes
one complete change:

```js
case "cities/loaded":
  return { ...state, loading: false, cities: action.payload };

case "rejcted":
  return { ...state, loading: false, error: action.payload };
```

Now every state change lives in one file and I can read all of them in one
place.

### Why the reducer never fetches

The reducer is a pure function. It only takes the old state and an action, and
returns the new state. The `fetch` calls happen in the provider, and only the
result is sent to the reducer:

```js
async function getCity(id) {
  dispatch({ type: "loading" });
  const res = await fetch(`${Base_URL}/cities/${id}`);
  const data = await res.json();
  dispatch({ type: "city/loaded", payload: data });
}
```

This keeps the reducer easy to follow. Same action in, same state out, always.

### Two contexts, not one

There are two separate providers:

- `CitiesContext` — the cities, the current city, loading and error
- `FakeAuthContext` — the user and whether they are logged in

They change at completely different times. Logging in should not make the city
list re-render, and loading a city has nothing to do with the user. Keeping
them apart also made each file much shorter.

### The protected route

`/app` and everything under it should only work when you are logged in. That
check is one small component:

```jsx
function AuthcationProtact({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate("/");
    },
    [isAuthenticated, navigate],
  );

  return isAuthenticated ? children : null;
}
```

It sends you back to the homepage if you are not logged in, and returns `null`
in the meantime so nothing flashes on the screen first.

---

## Custom hooks

Two small hooks, each doing one job.

**`useUrlPosition`** reads the latitude and longitude out of the URL:

```js
const [lat, lng] = useUrlPosition();
```

The map position lives in the URL (`/app/form?lat=38.7&lng=-9.1`). That means
you can copy the link, send it to someone, and they see the same place. It
also means the form and the map can both read the position without passing
props between them.

**`useGeolocation`** wraps the browser geolocation API. It returns the
position, a loading flag, an error, and the `getPosition` function that starts
the request.

---

## Routing

React Router does more here than just show pages. The app uses nested routes,
so the sidebar stays on screen and only its content changes:

```jsx
<Route path="app" element={<AuthcationProtact><Applayout /></AuthcationProtact>}>
  <Route index element={<Navigate replace to="cities" />} />
  <Route path="cities" element={<CityList />} />
  <Route path="cities/:id" element={<City />} />
  <Route path="countries" element={<CountryList />} />
  <Route path="form" element={<Form />} />
</Route>
```

The `<Outlet />` sits inside `Sidebar`, so the child route renders in the left
panel while the map stays mounted on the right. That matters: the map keeps
its zoom and position when you move between Cities, Countries and the form.
The `index` route redirects `/app` to `/app/cities`, so the app never opens on
an empty panel.

---

## The design

The visual design is mine. I did not use a UI library, so every style here is
plain CSS in CSS Modules.

![The landing page](docs/home.jpg)

A few decisions I made on purpose:

**One accent colour.** The red is used for the logo pin, the main buttons, and
the left edge of a saved city. Nothing else is coloured. This makes it very
clear what you can click.

**Two fonts with separate jobs.** Sora only for headings, set large and tight.
Manrope for everything you actually read.

**Depth instead of borders everywhere.** Surfaces are separated by a 1px line
at about 6–9% white, plus a soft shadow. Each shadow is two layers: a small
sharp one for the edge, and a wide faint one for the ambient light. One big
blur on its own just looks blurry.

**Contrast checked, not guessed.** The button text is white on red because
that measures 4.9:1. Dark text on the same red only reaches 3.6:1, which fails
the accessibility standard.

![The login page](docs/login.jpg)

Cities are grouped by country in a second tab:

<img src="docs/countries.png" width="360" alt="Cities grouped by country">

---

## Project structure

```
src/
├── App.jsx                    all the routes
├── index.css                  design tokens, resets, global styles
├── components/
│   ├── AuthcationProtact.jsx  the protected route wrapper
│   ├── CityItem.jsx           one row in the sidebar list
│   ├── CityList.jsx           the list of saved cities
│   ├── City.jsx               details for one city
│   ├── CountryList.jsx        cities grouped by country
│   ├── Form.jsx               add a new city
│   ├── Map.jsx                the Leaflet map
│   └── Sidebar.jsx            the left panel
├── contexts/
│   ├── CitiesContext.jsx      useReducer + fetching
│   └── FakeAuthContext.jsx    login state
├── hooks/
│   ├── useGeolocation.js
│   └── useUrlPosition.js
└── pages/
    ├── Homepage.jsx
    ├── Login.jsx
    ├── Product.jsx
    └── Pricing.jsx
```

---

## Known issues

I would rather list these than pretend they are not there.

**Opening a city detail causes a request loop.** Click a city in the sidebar
and the browser keeps requesting the same city until it runs out of
connections. The console shows `Maximum update depth exceeded` and a lot of
`ERR_INSUFFICIENT_RESOURCES`.

The cause: `getCity` is a normal function inside the provider, so React
creates a new copy of it on every render. `City.jsx` has `getCity` in its
effect dependency array. React compares dependencies by identity, so it sees a
"new" function every time and runs the effect again, which dispatches, which
re-renders, and so on.

The fix is to wrap it in `useCallback` with `[currentCity.id]`, so the
function keeps the same identity between renders. I found this by reading the
console instead of guessing, and I have left it here because the explanation
is more useful than a silent fix.

**Other things still open:**

- The login is fake. The user is hard-coded in `FakeAuthContext` and the state
  is lost on refresh. It shows the routing pattern, not real authentication.
- There is no hosted demo, because the data needs `json-server` running
  locally. Moving the cities into the bundle would fix that.
- **A file name that would break a Linux build.** The file on disk is
  `AppLayout.module.css`, but `Applayout.jsx` imports `./Applayout.module.css`
  with a small `l`. Windows and macOS do not care about the difference, so it
  runs fine here. Linux does care, and most CI and hosting services build on
  Linux, so this would fail there. I only found it by comparing the folder
  listing with the import line.
- Some names are misspelled in the code: `AuthcationProtact`, the `rejcted`
  action. They work, but they should be corrected.
- No tests.

---

## What I learned

Before this project I knew what `useReducer` was, but I had only used it on
small examples. Here I learned when it is actually better than `useState`:
when several pieces of state change together, and when the same change is
triggered from more than one place.

The second thing was dependency arrays. The request loop above is not a
Leaflet problem or a React Router problem. It happens because a function is a
new object on every render. That was not obvious to me, and finding it taught
me more than the feature itself did.

---

Map data from OpenStreetMap. Photos from Unsplash.
