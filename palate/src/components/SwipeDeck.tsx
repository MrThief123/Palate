import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { recipes } from "../data/recipe";
import RecipeCard from "./RecipeCard";
import "../styles/swipe.css";

export default function SwipeDeck() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);

  const recipe = recipes[currentIndex];

  function handlePointerDown() {
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;

    setPosition(e.clientX - window.innerWidth / 2);
  }

  function handlePointerUp() {
    setDragging(false);

    if (position > 120) {
      console.log("Liked", recipe.name);
      navigate(`/cooking/${recipe.id}`);
    } else if (position < -120) {
      console.log("Skipped", recipe.name);
      nextRecipe();
    }

    setPosition(0);
  }

  function nextRecipe() {
    setCurrentIndex((prev) => (prev + 1) % recipes.length);
  }

  if (!recipe) {
    return <h1>No recipes available</h1>;
  }

  return (
    <div
      className="swipe-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="swipe-card"
        onPointerDown={handlePointerDown}
        style={{
          transform: `translateX(${position}px) rotate(${position / 20}deg)`,
          transition: dragging ? "none" : "transform 0.3s ease",
        }}
      >
        <RecipeCard recipe={recipe} />
      </div>
    </div>
  );
}