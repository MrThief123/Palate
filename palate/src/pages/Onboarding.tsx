import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    diet: "",
    cuisines: [] as string[],
    allergies: [] as string[],
    cookingSkill: "",
    cookingTime: 30,
  });

  // Load saved preferences when updating profile
  useEffect(() => {
    async function loadPreferences() {
      try {
        const response = await fetch("http://localhost:5001/preferences", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          if (data) {
            setPreferences(data);
          }
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }

    loadPreferences();
  }, []);

  const cuisines = [
    "Italian",
    "Indian",
    "Japanese",
    "Chinese",
    "Thai",
    "Korean",
    "Mexican",
    "Greek",
    "French",
    "Spanish",
    "Vietnamese",
    "Turkish",
    "American",
    "Mediterranean",
    "Indonesian",
    "Malaysian",
    "Brazilian",
    "African",
    "Middle Eastern",
    "British",
  ];

  const allergies = [
    "Peanuts",
    "Tree Nuts",
    "Dairy",
    "Eggs",
    "Gluten",
    "Shellfish",
    "Fish",
    "Soy",
    "Sesame",
    "Wheat",
    "Corn",
    "Lactose",
    "Sulphites",
  ];

  const diets = [
    "No restrictions",
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Halal",
    "Kosher",
    "Keto",
    "Paleo",
  ];

  const skills = ["Beginner", "Intermediate", "Advanced"];

  function toggleArrayValue(field: "cuisines" | "allergies", value: string) {
    setPreferences((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
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

        <p>Tell us what you like to eat</p>

        <form onSubmit={handleSubmit}>
          <label>Diet</label>

          <div className="options">
            {diets.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  preferences.diet === item ? "option selected" : "option"
                }
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    diet: item,
                  })
                }
              >
                {item}
              </button>
            ))}
          </div>

          <label>Favourite cuisines</label>

          <div className="options">
            {cuisines.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  preferences.cuisines.includes(item)
                    ? "option selected"
                    : "option"
                }
                onClick={() => toggleArrayValue("cuisines", item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label>Allergies</label>

          <div className="options">
            {allergies.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  preferences.allergies.includes(item)
                    ? "option selected"
                    : "option"
                }
                onClick={() => toggleArrayValue("allergies", item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label>Cooking skill</label>

          <div className="options">
            {skills.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  preferences.cookingSkill === item
                    ? "option selected"
                    : "option"
                }
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    cookingSkill: item,
                  })
                }
              >
                {item}
              </button>
            ))}
          </div>

          <label>Maximum cooking time</label>

          <div className="time-slider">
            <div className="time-value">{preferences.cookingTime} minutes</div>

            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={preferences.cookingTime}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  cookingTime: Number(e.target.value),
                })
              }
            />

            <div className="slider-labels">
              <span>10 min</span>
              <span>2 hours</span>
            </div>
          </div>

          <button className="submit-button" type="submit">
            Save Preferences 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
