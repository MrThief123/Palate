import type { Recipe } from "../types/recipe";

import "../styles/recipe-card.css";


interface Props{

    recipe:Recipe;

}


export default function RecipeCard({
    recipe
}:Props){


return (

<div className="recipe-card">


<h1 className="recipe-title">

{recipe.name}

</h1>


<div className="recipe-meta">

{recipe.cuisine}

<br/>

⏱ {recipe.cookTime} minutes

<br/>

Difficulty:
{recipe.difficulty}

</div>



<p className="recipe-description">

{recipe.description}

</p>



<div className="recipe-section">

<h3>
Ingredients
</h3>


<ul>

{
recipe.ingredients.map(
ingredient=>(

<li key={ingredient}>

{ingredient}

</li>

))
}

</ul>

</div>


<div className="recipe-hint">

← Skip &nbsp;&nbsp; ❤️ Cook →

</div>


</div>

)

}