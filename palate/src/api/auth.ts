const API_URL = "http://localhost:5001";

export function loginWithGoogle() {
  window.location.href =
    `${API_URL}/auth/google`;
} 