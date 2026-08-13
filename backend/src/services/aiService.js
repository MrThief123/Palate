import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID;



export async function generateRecipes({
  preferences,
  memories,
  interactions = [],
  mealType,
  count = 10,
}) {
  const preferenceContext = `
Diet: ${preferences?.diet || "No specific diet"}
Cuisines: ${preferences?.cuisines?.join(", ") || "No preference"}
Allergies: ${preferences?.allergies?.join(", ") || "None"}
Cooking skill: ${preferences?.cookingSkill || "Not specified"}
Maximum cooking time: ${
    preferences?.cookingTime
      ? `${preferences.cookingTime} minutes`
      : "Not specified"
  }
`;

  const interactionContext =
    interactions.length > 0
      ? interactions
          .map(
            (interaction) =>
              `- ${interaction.action}: ${interaction.recipe_name} — ${interaction.cuisine || "Unknown cuisine"} — ${interaction.meal_type || "Unknown meal"}`
          )
          .join("\n")
      : "No previous recipe interactions.";

  const memoryContext =
    memories.length > 0
      ? memories
          .map(
            (memory) =>
              `- ${memory.type}: ${memory.content}`
          )
          .join("\n")
      : "No additional memories.";

  const prompt = `
You are Palate, an AI cooking assistant.

Generate ${count} distinct ${mealType} recipes for the user.

USER PREFERENCES:
${preferenceContext}

USER MEMORIES:
${memoryContext}

IMPORTANT REQUIREMENTS:

1. Respect ALL allergies. Never recommend an ingredient
   that conflicts with an allergy.

2. Respect the user's diet.

3. Prefer the user's favourite cuisines but can suggest others.

4. Respect their cooking skill level but can suggest slightly more advanced recipes.

5. Respect their maximum cooking time but can be flexible.

6. Make the recipes genuinely different from one another.

7. Recipes should be realistic and actually cookable.

8. Return ONLY valid JSON.

9. Do not include markdown or code fences.

USER RECIPE HISTORY:

The following interactions were retrieved from the user's
persistent recipe history in CockroachDB.

- "liked" means the user showed positive interest.
- "passed" means the user rejected the recipe.
- "cooked" means the user cooked the recipe.

Use this history to personalise recommendations.

Avoid recipes the user has already passed.

Avoid recipes that are substantially similar to recipes
the user has repeatedly passed.

Prefer patterns associated with recipes the user has liked.

${interactionContext}

Return exactly this structure:

{
  "recipes": [
    {
      "id": "recipe-001",
      "name": "Recipe name",
      "description": "Short brief description describing the recipe and meal",
      "mealType": "${mealType}",
      "cuisine": "Cuisine",
      "difficulty": "easy",
      "prepTime": 10,
      "cookTime": 15,
      "servings": 2,
    }
  ]
}

Return exactly ${count} recipes.
`;

  const command = new ConverseCommand({
    modelId: MODEL_ID,

    messages: [
      {
        role: "user",
        content: [
          {
            text: prompt,
          },
        ],
      },
    ],

    inferenceConfig: {
        maxTokens: 10000,
        temperature: 0.8,
    },
  });

  const response = await client.send(command);

  const text = response.output.message.content[0].text;

  // Remove accidental markdown fences if the model adds them
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return parsed.recipes;
}


export async function generateCookingRecipe({
  recipe,
  preferences,
  memories,
}) {
  const preferenceContext = `
Diet: ${preferences?.diet || "No specific diet"}
Cuisines: ${preferences?.cuisines?.join(", ") || "No preference"}
Allergies: ${preferences?.allergies?.join(", ") || "None"}
Cooking skill: ${preferences?.cookingSkill || "Not specified"}
Maximum cooking time: ${
    preferences?.cookingTime
      ? `${preferences.cookingTime} minutes`
      : "Not specified"
  }
`;

  const memoryContext =
    memories.length > 0
      ? memories
          .map(
            (memory) =>
              `- ${memory.type}: ${memory.content}`
          )
          .join("\n")
      : "No additional memories.";

  const prompt = `
You are Palate, an AI cooking assistant.

The user has chosen this recipe to cook:

RECIPE:
Name: ${recipe.name}
Description: ${recipe.description}
Meal type: ${recipe.mealType}
Cuisine: ${recipe.cuisine}
Difficulty: ${recipe.difficulty}
Preparation time: ${recipe.prepTime} minutes
Cooking time: ${recipe.cookTime} minutes
Servings: ${recipe.servings}

USER PREFERENCES:
${preferenceContext}

USER MEMORIES:
${memoryContext}

IMPORTANT REQUIREMENTS:

1. Respect ALL allergies. Never include an ingredient
   that conflicts with an allergy.

2. Respect the user's diet.

3. Keep the recipe consistent with the selected recipe.

4. Provide realistic quantities for every ingredient.

5. Provide clear, sequential cooking instructions.

6. Make the instructions appropriate for the user's
   cooking skill.

7. Include useful cooking times and temperatures
   where appropriate.

8. Do not unnecessarily change the recipe.

9. Return ONLY valid JSON.

10. Do not include markdown or code fences.

Return exactly this structure:

{
  "ingredients": [
    "ingredient with quantity",
    "ingredient with quantity"
  ],
  "instructions": [
    "Step 1",
    "Step 2",
    "Step 3"
  ]
}
`;

  const command = new ConverseCommand({
    modelId: MODEL_ID,

    messages: [
      {
        role: "user",
        content: [
          {
            text: prompt,
          },
        ],
      },
    ],

    inferenceConfig: {
      maxTokens: 4000,
      temperature: 0.5,
    },
  });

  const response = await client.send(command);

  const text = response.output.message.content[0].text;

  // Remove accidental markdown fences
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return {
    ingredients: parsed.ingredients,
    instructions: parsed.instructions,
  };
}

