import React, { useState } from "react";
import { useRouter } from "next/router";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData.detail)
          ? errorData.detail.map((d: any) => d.msg).join(", ")
          : errorData.detail || "Login failed";
        setErrorMessage(message);
        return;
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem("token", data.access_token);
      setSuccessMessage("Login successful!");
      router.push("/");
    } catch (error: any) {
      setErrorMessage(error.message || "An unknown error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 border border-cyan-600 rounded-xl shadow-md bg-gray-900 text-white font-mono">
        <h2 className="text-3xl font-bold mb-6 text-center text-cyan-400 tracking-wide drop-shadow-md">
          🔐 Cyber Defense Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm text-cyan-300">
              Email / Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-cyan-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-cyan-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm text-cyan-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-cyan-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-cyan-500"
              placeholder="••••••"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="text-green-400 text-sm text-center">{successMessage}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded transition duration-200 uppercase tracking-wide shadow-md"
          >
            Access System
          </button>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6 select-none">
          © 2025 Cyber Defense Suite
        </p>
      </div>

      <style jsx>{`
        div {
          /* subtle neon glow, more diffused */
          box-shadow: 0 0 8px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.15);
        }
        h2 {
          /* mild glow on heading */
          text-shadow: 0 0 4px rgba(0, 255, 255, 0.6);
        }
        button {
          /* slight shadow for the button */
          box-shadow: 0 0 6px rgba(0, 200, 255, 0.6);
        }
        input:focus {
          box-shadow: 0 0 6px rgba(0, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
