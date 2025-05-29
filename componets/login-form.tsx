import React, { useState } from "react";
import { useRouter } from "next/router"; // ✅ Next.js router

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            setErrorMessage(errorData.detail.map((d: any) => d.msg).join(", "));
          } else if (typeof errorData.detail === "string") {
            setErrorMessage(errorData.detail);
          } else {
            setErrorMessage("Login failed");
          }
        } else {
          setErrorMessage("Login failed");
        }
        return;
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem("token", data.access_token);
      setSuccessMessage("Login successful!");
      router.push("/"); // ✅ Redirect to homepage

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen dark-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-600 text-center">{successMessage}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
