// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../slices/userSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors de l'inscription");
        setLoading(false);
      } else {
        setLoading(false);
        setSuccess("Inscription réussie ! Redirection vers la page de connexion...");
        
        // Attendre 2 secondes avant la redirection pour que l'utilisateur puisse voir le message
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError("Erreur serveur. Merci de réessayer plus tard.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="register-page" style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
      }}>
        <h2 className="text-center mb-4" style={{ color: "var(--primary-color)" }}>Inscription</h2>
        
        {error && (
          <div className="alert alert-error mb-3">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-3">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input
              className="form-input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
              placeholder="Entrez votre nom complet"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmer mot de passe</label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mt-3"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
          <p className="text-center mt-3">
           Déjà un compte ?{" "}
          <a href="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
             Se connecter
            </a>
            </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
