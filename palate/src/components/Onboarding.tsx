import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    diet: "",
    cuisines: "",
    allergies: "",
    cookingSkill: "",
    cookingTime: 30,
  });

  function updateField(field: string, value: string | number) {
    setPreferences({
      ...preferences,
      [field]: value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("http://localhost:5001/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      navigate("/discover");
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <h1>Welcome to Palate 🍴</h1>

        <p>Tell us about your cooking preferences</p>

        <form onSubmit={handleSubmit}>
          <label>Diet</label>

          <select
            value={preferences.diet}
            onChange={(e) => updateField("diet", e.target.value)}
          >
            <option value="">Select</option>

            <option>No restrictions</option>

            <option>Vegetarian</option>

            <option>Vegan</option>

            <option>Halal</option>
          </select>

          <label>Favourite cuisines</label>

          <input
            placeholder="Italian, Indian, Japanese..."
            value={preferences.cuisines}
            onChange={(e) => updateField("cuisines", e.target.value)}
          />

          <label>Allergies</label>

          <input
            placeholder="Peanuts, dairy..."
            value={preferences.allergies}
            onChange={(e) => updateField("allergies", e.target.value)}
          />

          <label>Cooking skill</label>

          <select
            value={preferences.cookingSkill}
            onChange={(e) => updateField("cookingSkill", e.target.value)}
          >
            <option value="">Select</option>

            <option>Beginner</option>

            <option>Intermediate</option>

            <option>Advanced</option>
          </select>

          <label>Maximum cooking time</label>

          <input
            type="number"
            value={preferences.cookingTime}
            onChange={(e) => updateField("cookingTime", Number(e.target.value))}
          />

          <button type="submit">Start Cooking 🚀</button>
        </form>
      </div>
    </div>
  );
}
