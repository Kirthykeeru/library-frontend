import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BooksPage } from "./pages/BooksPage";
import { MembersPage } from "./pages/MembersPage";
import { BorrowRecordsPage } from "./pages/BorrowRecordsPage";
import { MyBorrowsPage } from "./pages/MyBorrowsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public: anyone can browse the catalog, borrowing is gated inline */}
            <Route path="/books" element={<BooksPage />} />

            {/* Any authenticated user (staff or student) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-borrows" element={<MyBorrowsPage />} />
            </Route>

            {/* Staff only */}
            <Route element={<ProtectedRoute staffOnly />}>
              <Route path="/members" element={<MembersPage />} />
              <Route path="/borrow-records" element={<BorrowRecordsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/books" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
