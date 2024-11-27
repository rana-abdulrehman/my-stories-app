import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AuthGuard from "./authGuard/AuthGuard";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Notifications from "./components/Notifications";
import Toast from "./components/Toast";
import { UserProvider } from "./context/UserContext";
import AdminBoard from "./pages/AdminBoard";
import CreatePostPage from "./pages/CreatePostPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <div className="flex flex-col min-h-screen bg-blue">
          <Navbar />
          <div className="flex-grow">
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/signup"
                  element={
                    <AuthGuard>
                      <SignupPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AuthGuard>
                      <LoginPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <AuthGuard requiredRole="user">
                      <CreatePostPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin-board"
                  element={
                    <AuthGuard requiredRole="admin">
                      <AdminBoard />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <AuthGuard requiredRole="user">
                      <Notifications />
                    </AuthGuard>
                  }
                />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </UserProvider>
      <Toast />
    </Router>
  );
};

export default App;

