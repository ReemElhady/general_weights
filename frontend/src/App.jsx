import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastProvider } from "./components/ui/toast";
import LiveWeightPage from "./pages/LiveWeightPage";
import LiveWeightWrapper from "./pages/LiveWeightWrapper";


import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Customers from "./pages/Customers";
import Vehicles from "./pages/Vehicles";
import BlockedVehicles from "./pages/Blocked_Vehicles";
import Scales from "./pages/Scales";
import Drivers from "./pages/Drivers";
import Settings from "./pages/Settings";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/live-weight/:scaleId" element={<LiveWeightWrapper />} />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <Tickets />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Layout>
                <Vehicles />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers"
          element={
            <ProtectedRoute>
              <Layout>
                <Drivers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/scales"
          element={
            <ProtectedRoute>
              <Layout>
                <Scales />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/blocked-vehicles"
          element={
            <ProtectedRoute>
              <Layout>
                <BlockedVehicles />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </ToastProvider>
  );
}

export default App;
