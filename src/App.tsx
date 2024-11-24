// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import CreatePostPage from "./pages/CreatePostPage";
import AdminBoard from "./pages/AdminBoard";
import { UserProvider } from "./context/UserContext";
import Toast from "./components/Toast";

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
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/admin-board" element={<AdminBoard />} />
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