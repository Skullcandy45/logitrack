# 📦 LogiTrack

A modern shipment tracking and logistics management web application built with React, Redux Toolkit, and Tailwind CSS.

---

## 🚀 Features

- **Dashboard** — At-a-glance stats including total shipments, active deliveries, delivered count, and pending shipments, with a recent activity feed.
- **Shipments List** — Paginated, searchable, and filterable table of all shipments with status badges.
- **Shipment Detail** — Full breakdown of a shipment including tracking timeline, status history, and metadata.
- **Add Shipment** — Form to create a new shipment with validation and date pickers.
- **Edit Shipment** — Edit core shipment fields with an unsaved-changes guard that warns before navigating away.
- **Status & Timeline Tracking** — Visual timeline with per-event timestamps and milestone icons.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [React Router v6](https://reactrouter.com/) | Client-side routing (Data Router API) |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Global state management |
| [React Redux](https://react-redux.js.org/) | React bindings for Redux |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Lucide React](https://lucide.dev/) | Icon library |

---

## 📁 Project Structure

```
logitrack/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── App.jsx                  # Root router configuration
    ├── main.jsx                 # React entry point
    ├── index.css                # Global styles
    ├── app/
    │   └── store.js             # Redux store setup
    ├── components/
    │   ├── Navbar.jsx           # Top navigation bar
    │   ├── Pagination.jsx       # Reusable pagination component
    │   ├── ShipmentForm.jsx     # Shared form for add/edit shipments
    │   ├── ShipmentRow.jsx      # Table row for shipment list
    │   ├── StatCard.jsx         # Dashboard stat cards
    │   ├── StatusBadge.jsx      # Colored status label
    │   └── TrackingTimeline.jsx # Visual shipment timeline
    ├── features/
    │   └── shipments/
    │       ├── shipmentsData.js # Seed data
    │       └── shipmentsSlice.js# Redux slice (CRUD + edit reducers)
    ├── hooks/
    │   └── useUnsavedChanges.js # Navigation guard hook
    ├── pages/
    │   ├── DashboardPage.jsx
    │   ├── ShipmentsPage.jsx
    │   ├── ShipmentDetailPage.jsx
    │   ├── AddShipmentPage.jsx
    │   └── EditShipmentPage.jsx
    └── utils/
        └── helpers.js           # Formatting utilities
```

---

## 📋 Routes

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/shipments` | Shipments list |
| `/shipments/:id` | Shipment detail view |
| `/shipments/:id/edit` | Edit a shipment |
| `/add` | Add a new shipment |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Skullcandy45/logitrack.git

# Navigate into the project directory
cd logitrack

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open your browser and go to [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
```

The production files will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🔒 Unsaved Changes Guard

The edit shipment page uses a custom `useUnsavedChanges` hook that:
- Blocks in-app navigation via React Router's `useBlocker` API.
- Fires a `beforeunload` browser dialog on tab close or reload.
- Automatically clears when the form is submitted successfully.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
