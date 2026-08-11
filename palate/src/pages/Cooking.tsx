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

  const [detailedRecipe, setDetailedRecipe] =
    useState<DetailedRecipe | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateRecipe() {
      if (!recipe) {
        setError("Recipe not found.");
        setLoading(false);
        return;
      }

      try {
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
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to generate recipe"
          );
        }

        const data = await response.json();

        setDetailedRecipe(data.recipe);
      } catch (err) {
        console.error(err);

        setError(
          "Something went wrong generating the recipe."
        );
      } finally {
        setLoading(false);
      }
    }

    generateRecipe();
  }, [recipe]);


  // ------------------------------------------
  // Recipe wasn't passed from Discover
  // ------------------------------------------

  if (!recipe) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">
          Recipe not found
        </h1>

        <button
          onClick={() => navigate("/discover")}
          className="mt-5 bg-black text-white px-5 py-3 rounded-xl"
        >
          Back to Discover
        </button>
      </div>
    );
  }


  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (loading) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold">
          {recipe.name}
        </h1>

        <p className="mt-5 text-gray-500">
          Preparing your recipe...
        </p>
      </div>
    );
  }


  // ------------------------------------------
  // Error
  // ------------------------------------------

  if (error || !detailedRecipe) {
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-500">
          {error}
        </p>

        <button
          onClick={() => navigate("/discover")}
          className="mt-5 bg-black text-white px-5 py-3 rounded-xl"
        >
          Back to Discover
        </button>
      </div>
    );
  }


  // ------------------------------------------
  // Full recipe
  // ------------------------------------------

  return (
    <div className="p-10 max-w-xl mx-auto">

      <h1 className="text-4xl font-bold">
        {detailedRecipe.name}
      </h1>

      <p className="mt-3 text-gray-600">
        {detailedRecipe.description}
      </p>


      {/* Metadata */}

      <div className="mt-5 flex gap-4 text-sm text-gray-600">
        <span>
          ⏱ {detailedRecipe.cookTime} min
        </span>

        <span>
          👨‍🍳 {detailedRecipe.difficulty}
        </span>

        <span>
          🍽 {detailedRecipe.servings} servings
        </span>
      </div>


      {/* Ingredients */}

      <section className="mt-8">

        <h2 className="text-xl font-bold">
          Ingredients
        </h2>

        <ul className="mt-3 list-disc pl-5 space-y-2">

          {detailedRecipe.ingredients.map(
            (ingredient, index) => (
              <li key={index}>
                {ingredient}
              </li>
            )
          )}

        </ul>

      </section>


      {/* Instructions */}

      <section className="mt-8">

        <h2 className="text-xl font-bold">
          Instructions
        </h2>

        <ol className="mt-3 space-y-5">

          {detailedRecipe.instructions.map(
            (instruction, index) => (
              <li
                key={index}
                className="flex gap-4"
              >
                <span className="font-bold">
                  {index + 1}.
                </span>

                <span>
                  {instruction}
                </span>
              </li>
            )
          )}

        </ol>

      </section>


      {/* Finished */}

      <button
        onClick={() =>
          navigate(
            `/feedback/${detailedRecipe.id}`
          )
        }
        className="mt-10 w-full bg-black text-white px-5 py-3 rounded-xl"
      >
        Finished Cooking
      </button>

    </div>
  );
}
