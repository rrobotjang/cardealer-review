# Frontend Design System — Best Cars

Design system for the React SPA (`frontend/`). Based on the **Bootstrap 5** token
model (the previous Django-template UI used Bootstrap 5 and the look must be preserved).

## Tokens

| Token | Value | Source |
|---|---|---|
| `--bs-primary` | `#0f62fe` | IBM blue (brand) |
| `--bs-primary-rgb` | `15, 98, 254` | derived |
| `--bs-link-color` / hover | `#0f62fe` / `#0530ad` | IBM blue ramp |
| Type scale | `display-4` hero → `h1`–`h6` → `text-muted` body | Bootstrap scale |
| Spacing | `1rem` grid units, Bootstrap `g-3`/`g-4` gutters | Bootstrap scale |
| Radii / shadows | `rounded` cards + `shadow-sm` / `card-lift` hover | Bootstrap + custom |
| Neutrals | `#f4f4f4` page bg, `#ffffff` cards, `#161616` footer | IBM gray ramp |

## Components

- **Navbar** — white sticky, brand `bi-car-front-fill` + wordmark, active-link
  highlighting via react-router `NavLink`.
- **Cards** — `border-0 shadow-sm card-lift` (hover: translateY(-4px) + shadow).
- **Badges** — sentiment: `badge-soft-success` (positive) / `badge-soft-danger`
  (negative) / `badge-soft-secondary` (neutral); state pill `bg-primary`.
- **Buttons** — `variant="primary"` (IBM blue) / `outline-*` for secondary actions.
- **Forms** — react-bootstrap `Form`; required fields marked, inline validation via
  `required` + server errors surfaced in `Alert`s.
- **States** — every data page renders loading (`Spinner`), empty, and error
  (`Alert` + Retry) states.
- **Icons** — `bootstrap-icons` (SVG font), never emojis.

## Layout rules

- Page container `max-width: 720–860px` for forms/about/contact, fluid for catalog.
- Footer pinned via flex `min-vh-100` wrapper.
- Responsive breakpoints verified at 375 / 768 / 1280px.
