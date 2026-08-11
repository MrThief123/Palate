import { useState } from "react";
import Navbar from "../components/Navbar";
import SwipeDeck from "../components/SwipeDeck";
import Chat from "../components/Chat";

export default function Discover() {
  const [selectedMeal, setSelectedMeal] = useState("Dinner");
  const [chatOpen, setChatOpen] = useState(false);

  const meals = ["Breakfast", "Lunch", "Dinner", "Dessert"];

  return (
    <div>
      <Navbar />

      <main className="flex flex-col items-center mt-10 px-4">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">
          Discover
        </h1>

        {/* Meal buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {meals.map((meal) => (
            <button
              key={meal}
              type="button"
              onClick={() => {
                console.log("Selected meal:", meal);
                setSelectedMeal(meal);
              }}
              className={`px-5 py-2 rounded-full transition ${
                selectedMeal === meal
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              }`}
            >
              {meal}
            </button>
          ))}
        </div>

        {/* Currently selected meal */}
        <p className="text-gray-500 mb-4">
          Showing {selectedMeal} recipes
        </p>

        {/* Recipe deck */}
        <SwipeDeck />

        {/* Chat button */}
        <button
          type="button"
          onClick={() => {
            console.log("Opening chat");
            setChatOpen(true);
          }}
          className="mt-8 mb-10 px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          💬 Chat with Palate
        </button>

      </main>

      {/* Chat */}
      {chatOpen && (
        <Chat
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}