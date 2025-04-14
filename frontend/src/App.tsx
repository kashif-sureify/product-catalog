import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound";
function App() {
  const { user, authCheck, isCheckingAuth } = useAuthStore();

  

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-ping text-red-600 size-10" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-base-200 transition-colors duration-300">
        <Routes>
          <Route
            path="/"
            element={!user ? <Navigate to={"/login"} /> : <HomePage />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to={"/"} />}
          />

          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;
