import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import "../styles/swipe.css";
import type { Recipe } from "../types/recipe";

type SwipeDeckProps = {
  mealType?: string;
};

type RecipesResponse = {
  recipes: Recipe[];
  message?: string;
};

export default function SwipeDeck({ mealType = "dinner" }: SwipeDeckProps) {
  const navigate = useNavigate();

  // ============================================
  // RECIPE STATE
  // ============================================

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ============================================
  // SWIPE STATE
  // ============================================

  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);

  // ============================================
  // LOADING / ERROR STATE
  // ============================================

  const [loading, setLoading] = useState(true);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // GENERATE MORE RECIPES
  // ============================================

  async function fetchMoreRecipes() {
    try {
      setGeneratingMore(true);
      setError(null);

      console.log("[SwipeDeck] Generating more recipes...");

      console.log("[SwipeDeck] Passed recipes:", passedRecipes);

      const response = await fetch(`http://localhost:5001/recommendations`, {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          mealType,
        }),
      });

      if (!response.ok) {
        let message = "Failed to generate recipes";

        try {
          const data = await response.json();

          if (data.message) {
            message = data.message;
          }
        } catch {
          // Ignore JSON parsing errors
        }

        throw new Error(message);
      }

      const data: RecipesResponse = await response.json();

      console.log("[SwipeDeck] New recipes:", data.recipes);

      if (!data.recipes || data.recipes.length === 0) {
        throw new Error("AI did not return any recipes");
      }

      // Add the new recipes to the existing deck.
      setRecipes((prev) => [...prev, ...data.recipes]);
    } catch (error: unknown) {
      console.error("[SwipeDeck] Failed to generate more recipes:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to generate more recipes");
      }
    } finally {
      setGeneratingMore(false);
      setLoading(false);
    }
  }

  async function saveRecipeInteraction(
    recipe: Recipe,
    action: "liked" | "passed" | "cooked",
    mealType: string,
  ) {
    try {
      const response = await fetch(
        "http://localhost:5001/recipe-interactions",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            recipeId: recipe.id,
            recipeName: recipe.name,
            mealType,
            cuisine: recipe.cuisine,
            action,
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.message || "Failed to save recipe interaction");
      }

      console.log("[SwipeDeck] Interaction saved:", action, recipe.name);
    } catch (error) {
      // We don't want a database failure
      // to stop the swipe experience.
      console.error("[SwipeDeck] Failed to save interaction:", error);
    }
  }

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    // Reset everything when meal type changes.

    setRecipes([]);
    setCurrentIndex(0);
    setPosition(0);

    // Generate first batch.
    fetchMoreRecipes();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealType]);

  // ============================================
  // CURRENT RECIPE
  // ============================================

  const recipe = recipes[currentIndex];

  // ============================================
  // POINTER DOWN
  // ============================================

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    setDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);
  }

  // ============================================
  // POINTER MOVE
  // ============================================

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;

    setPosition(e.clientX - window.innerWidth / 2);
  }

  // ============================================
  // POINTER UP
  // ============================================

  async function handlePointerUp() {
    setDragging(false);

    if (!recipe) {
      return;
    }

    // ==========================================
    // SWIPE RIGHT = LIKE
    // ==========================================

    if (position > 120) {
      console.log("[SwipeDeck] Liked:", recipe.name);

      // Persist the interaction in CockroachDB.
      await saveRecipeInteraction(recipe, "liked", mealType);

      // Send the recipe to the cooking page.
      navigate(`/cooking/${recipe.id}`, {
        state: {
          recipe,
        },
      });

      setPosition(0);

      return;
    }

    // ==========================================
    // SWIPE LEFT = PASS
    // ==========================================

    if (position < -120) {
      console.log("[SwipeDeck] Passed:", recipe.name);

      // Persist the interaction in CockroachDB.
      await saveRecipeInteraction(recipe, "passed", mealType);

      // Move to next recipe.
      nextRecipe();
    }

    setPosition(0);
  }

  // ============================================
  // NEXT RECIPE
  // ============================================

  function nextRecipe() {
    setCurrentIndex((prev) => prev + 1);
  }

  // ============================================
  // LOADING
  // ============================================

  if (loading && recipes.length === 0) {
    return (
      <div className="text-center">
        <h2>Finding recipes for you...</h2>

        <p>Palate is creating your recommendations.</p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error && recipes.length === 0) {
    return (
      <div className="text-center">
        <h2>Couldn't load recipes</h2>

        <p>{error}</p>

        <button onClick={fetchMoreRecipes} disabled={generatingMore}>
          {generatingMore ? "Generating..." : "Try Again"}
        </button>
      </div>
    );
  }

  // ============================================
  // NO MORE RECIPES
  // ============================================

  if (!recipe) {
    return (
      <div className="text-center">
        <h2>No more recipes</h2>

        <p>You've gone through all the current recommendations.</p>

        <button onClick={fetchMoreRecipes} disabled={generatingMore}>
          {generatingMore ? "Finding more recipes..." : "Find More Recipes"}
        </button>
      </div>
    );
  }

  // ============================================
  // RECIPE CARD
  // ============================================

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
          transform: `
            translateX(${position}px)
            rotate(${position / 20}deg)
          `,

          transition: dragging ? "none" : "transform 0.3s ease",

          touchAction: "none",
        }}
      >
        <RecipeCard recipe={recipe} />
      </div>

      {/* Optional status while more recipes
          are being generated */}
      {generatingMore && (
        <p className="text-center mt-4">Finding more recipes...</p>
      )}
    </div>
  );
}
