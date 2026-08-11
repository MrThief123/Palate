export interface Recipe {
  id: string;
  name: string;
  description: string;

  mealType: string;
  cuisine: string;
  difficulty: string;

  prepTime: number;
  cookTime: number;
  servings: number;

  ingredients: string[];
  instructions?: string[];
  mainIngredients: string[];
}
