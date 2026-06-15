// src/App.jsx
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import ShipmentsPage from './pages/ShipmentsPage'
import ShipmentDetailPage from './pages/ShipmentDetailPage'
import AddShipmentPage from './pages/AddShipmentPage'
import EditShipmentPage from './pages/EditShipmentPage'

function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'shipments', element: <ShipmentsPage /> },
      { path: 'shipments/:id', element: <ShipmentDetailPage /> },
      { path: 'shipments/:id/edit', element: <EditShipmentPage /> },
      { path: 'add', element: <AddShipmentPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
