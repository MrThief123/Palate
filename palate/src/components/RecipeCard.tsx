import type { Recipe } from "../types/recipe";

interface Props {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-96 h-[450px]">
      <h1 className="text-3xl font-bold">
        {recipe.name}
      </h1>

      <p className="mt-3">{recipe.cuisine}</p>

      <p>⏱ {recipe.cookTime} minutes</p>

      <p>Difficulty: {recipe.difficulty}</p>

      <p className="mt-5">{recipe.description}</p>

      <div className="mt-5">
        Ingredients:
        <ul>
          {recipe.ingredients.map((i) => (
            <li key={i}>• {i}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}