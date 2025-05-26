// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Échec de la connexion");
        setLoading(false);
      } else {
        // Connexion réussie
        dispatch(setUserInfo(data));
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        // Redirection vers la page précédente si elle existe, sinon vers la page d'accueil
        const from = location.state?.from || "/";
        navigate(from);
      }
    } catch (err) {
      setError("Erreur serveur. Réessayez plus tard.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="login-page" style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 className="text-center mb-4" style={{ color: "var(--primary-color)" }}>Connexion</h2>
        
        {error && (
          <div className="alert alert-error mb-3">
            {error}
          </div>
        )}
        
        {location.state?.from === "/placeorder" && (
          <div className="alert alert-warning mb-3">
            Veuillez vous connecter pour passer votre commande
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <p className="text-center mt-3">
            Pas encore de compte ?{" "}
            <a href="/register" style={{ color: "#2563eb", fontWeight: 600 }}>
             S'inscrire
            </a>
            </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
