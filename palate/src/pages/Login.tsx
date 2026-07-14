import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { loginWithGoogle } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-content">
        <h1 className="login-title">
          🍴 Palate
        </h1>

        <p className="login-subtitle">
          Your AI cooking companion
        </p>

        <button
          className="login-button"
          onClick={loginWithGoogle}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}