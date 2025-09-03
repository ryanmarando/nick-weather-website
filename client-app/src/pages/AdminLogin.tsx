import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../functions/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log("Login clicked");

    try {
      console.log("Sending POST...");
      const res: any = await fetchAPI(`/auth/login`, {
        method: "POST",
        body: { email, password },
      });
      console.log("Response received:", res);

      // Save token in localStorage
      localStorage.setItem("token", res.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Login failed");
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
