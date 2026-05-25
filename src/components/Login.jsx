import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ setUser, setActiveSection }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = await loginUser(email, password);
    setLoading(false);
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setActiveSection("dashboard");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div style={{ background: "#1a1a2e", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "400px", border: "1px solid #333" }}>
        <h2 style={{ color: "#fff", marginBottom: "1.5rem", textAlign: "center" }}>Login</h2>
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #444", background: "#0f0f23", color: "#fff", boxSizing: "border-box" }} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", borderRadius: "8px", border: "1px solid #444", background: "#0f0f23", color: "#fff", boxSizing: "border-box" }} required />
          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "none", background: "#6c63ff", color: "#fff", fontSize: "1rem", cursor: "pointer" }}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p style={{ color: "#aaa", textAlign: "center", marginTop: "1rem" }}>
          No account?{" "}
          <span onClick={() => setActiveSection("register")} style={{ color: "#6c63ff", cursor: "pointer" }}>Register</span>
        </p>
      </div>
    </div>
  );
}
