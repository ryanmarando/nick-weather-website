import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../functions/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //   const login = await fetchAPI("/auth/login", {
  //     method: "POST",
  //     body: { email: "nick.dunn@gmail.com", password: "xxx" },
  //   });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple client-side auth (replace with API later)
    if (username === "admin" && password === "password123") {
      navigate("/dashboard"); // redirect to dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 p-2 w-full rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded w-full"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
