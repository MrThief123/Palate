import Navbar from "../components/Navbar";
import SwipeDeck from "../components/SwipeDeck";

export default function Discover() {
  return (
    <div>
      <Navbar />

      <div className="flex justify-center mt-10">
        <SwipeDeck />
      </div>
    </div>
  );
}