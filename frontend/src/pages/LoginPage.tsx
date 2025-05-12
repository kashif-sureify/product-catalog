import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login } = useAuthStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };
  return (
    <div className="h-screen w-full hero-bg">
      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
          <h1 className="text-center text-white text-2xl font-bold mb-4">
            Login
          </h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email
                <input
                  type="email"
                  className="w-full px-3 py-2 mt-1 border-gray-700 rounded-md bg-tr text-white focus:outline-none focus:ring"
                  placeholder="you@example.com"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
                <input
                  type="text"
                  className="w-full px-3 py-2 mt-1 border-gray-700 rounded-md bg-tr text-white focus:outline-none focus:ring"
                  placeholder="************"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-red-600 font-semibold rounded-md hover:bg-red-700"
            >
              Login
            </button>
          </form>

          <div className="text-center text-gray-400">
            Don&apos;t have an account ?{" "}
            <Link
              to="/signup"
              aria-label="signup"
              className="text-red-500 hover:underline"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
