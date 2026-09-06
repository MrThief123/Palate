import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Recipe {
  id: string;
  name: string;
  description: string;
  mealType: string;
  cuisine: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
}

interface DetailedRecipe extends Recipe {
  ingredients: string[];
  instructions: string[];
}

export default function Cooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const recipe = location.state?.recipe as Recipe | undefined;

  const [detailedRecipe, setDetailedRecipe] = useState<DetailedRecipe | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // ============================================
  // CACHE KEY
  //
  // Each recipe gets its own cached version.
  // ============================================

  const cacheKey = recipe ? `palate-cooking-${recipe.id}` : null;

  // ============================================
  // GENERATE / LOAD RECIPE
  // ============================================

  useEffect(() => {
    async function generateRecipe() {
      if (!recipe) {
        setError("Recipe not found.");
        setLoading(false);
        return;
      }

      // ==========================================
      // CHECK SESSION STORAGE FIRST
      // ==========================================

      const cachedRecipe = cacheKey ? sessionStorage.getItem(cacheKey) : null;

      if (cachedRecipe) {
        try {
          const parsedRecipe = JSON.parse(cachedRecipe) as DetailedRecipe;

          console.log("[Cooking] Loading cached recipe:", parsedRecipe.name);

          setDetailedRecipe(parsedRecipe);
          setLoading(false);

          return;
        } catch (error) {
          console.error("[Cooking] Failed to parse cached recipe:", error);

          // Remove corrupted cache
          if (cacheKey) {
            sessionStorage.removeItem(cacheKey);
          }
        }
      }

      // ==========================================
      // NO CACHE → GENERATE RECIPE
      // ==========================================

      try {
        console.log("[Cooking] Generating recipe:", recipe.name);

        const response = await fetch(
          "http://localhost:5001/recommendations/cooking",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            credentials: "include",

            body: JSON.stringify({
              recipe,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Failed to generate recipe");
        }

        const data = await response.json();

        // Combine the original lightweight recipe
        // with the generated ingredients/instructions.
        const generatedRecipe: DetailedRecipe = {
          ...recipe,
          ...data.recipe,
        };

        // ========================================
        // SAVE TO REACT STATE
        // ========================================

        setDetailedRecipe(generatedRecipe);

        // ========================================
        // SAVE TO SESSION STORAGE
        //
        // This prevents regeneration when the
        // user navigates away and comes back.
        // ========================================

        if (cacheKey) {
          sessionStorage.setItem(cacheKey, JSON.stringify(generatedRecipe));
        }

        console.log(
          "[Cooking] Recipe generated and cached:",
          generatedRecipe.name,
        );
      } catch (err) {
        console.error(err);

        setError("Something went wrong generating the recipe.");
      } finally {
        setLoading(false);
      }
    }

    generateRecipe();
  }, [recipe, cacheKey]);

  // ============================================
  // RECIPE NOT FOUND
  // ============================================

  if (!recipe) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Recipe not found</h1>

        <button
          onClick={() => navigate("/discover")}
          className="mt-5 bg-black text-white px-5 py-3 rounded-xl"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold">{recipe.name}</h1>

        <p className="mt-5 text-gray-500">Preparing your recipe...</p>
      </div>
    );
  }

  // ============================================
  // ERROR
  // ============================================

  if (error || !detailedRecipe) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Something went wrong</h1>

        <p className="mt-3 text-gray-500">{error}</p>

        <button
          onClick={() => navigate("/discover")}
          className="mt-5 bg-black text-white px-5 py-3 rounded-xl"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  // ============================================
  // FULL RECIPE
  // ============================================

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold">{detailedRecipe.name}</h1>

      <p className="mt-3 text-gray-600">{detailedRecipe.description}</p>

      {/* Metadata */}

      <div className="mt-5 flex gap-4 text-sm text-gray-600">
        <span>⏱ {detailedRecipe.cookTime} min</span>

        <span>👨‍🍳 {detailedRecipe.difficulty}</span>

        <span>🍽 {detailedRecipe.servings} servings</span>
      </div>

      {/* Ingredients */}

      <section className="mt-8">
        <h2 className="text-xl font-bold">Ingredients</h2>

        <ul className="mt-3 list-disc pl-5 space-y-2">
          {detailedRecipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </section>

      {/* Instructions */}

      <section className="mt-8">
        <h2 className="text-xl font-bold">Instructions</h2>

        <ol className="mt-3 space-y-5">
          {detailedRecipe.instructions.map((instruction, index) => (
            <li key={index} className="flex gap-4">
              <span className="font-bold">{index + 1}.</span>

              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Finished */}

      <button
        onClick={() =>
          navigate(`/feedback/${detailedRecipe.id}`, {
            state: {
              recipe: detailedRecipe,
            },
          })
        }
        className="mt-10 w-full bg-black text-white px-5 py-3 rounded-xl"
      >
        Finished Cooking
      </button>
    </div>
  );
}
