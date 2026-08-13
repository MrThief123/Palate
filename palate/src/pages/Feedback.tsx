import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { Recipe } from "../types/recipe";

export default function Feedback() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const recipe = location.state?.recipe as Recipe | undefined;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    if (!recipe) {
      setError("Recipe information is missing.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(
        "http://localhost:5001/recommendations/feedback",
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            recipeId: id || recipe.id,
            recipeName: recipe.name,
            mealType: recipe.mealType,
            cuisine: recipe.cuisine,
            rating,
            feedback: feedback.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit feedback"
        );
      }

      console.log(
        "[Feedback] Submitted successfully"
      );

      navigate("/discover");
    } catch (error) {
      console.error(
        "[Feedback] Submission error:",
        error
      );

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to submit feedback");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-10">
      <h1 className="text-3xl font-bold">
        How was it?
      </h1>

      {recipe && (
        <p className="mt-2 text-gray-600">
          How did you find{" "}
          <strong>{recipe.name}</strong>?
        </p>
      )}

      {/* Rating */}

      <div className="mt-8">
        <p className="font-medium mb-3">
          Your rating
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-4xl transition ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Written feedback */}

      <div className="mt-8">
        <p className="font-medium mb-3">
          Tell Palate more
        </p>

        <textarea
          value={feedback}
          onChange={(e) =>
            setFeedback(e.target.value)
          }
          className="border w-full p-3 rounded-xl min-h-32"
          placeholder={`Any feedback?
Too spicy?
Too difficult?
Would you make it again?`}
        />
      </div>

      {/* Error */}

      {error && (
        <p className="mt-4 text-red-500">
          {error}
        </p>
      )}

      {/* Submit */}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-5 bg-black text-white px-5 py-3 rounded-xl disabled:opacity-50"
      >
        {submitting
          ? "Saving..."
          : "Submit Feedback"}
      </button>
    </div>
  );
}