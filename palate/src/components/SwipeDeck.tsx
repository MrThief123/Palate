import TinderCard from "react-tinder-card";
import { recipes } from "../data/recipe";
import RecipeCard from "./RecipeCard";
import { useNavigate } from "react-router-dom";


export default function SwipeDeck(){

const navigate = useNavigate();


function swipe(
direction:string,
id:string
){

console.log(direction);


if(direction==="right"){

navigate(`/cooking/${id}`)

}

}



return (

<div className="
relative
w-96
h-[500px]
">


{
recipes.map(recipe=>(


<TinderCard

key={recipe.id}

onSwipe={(dir)=>
swipe(dir,recipe.id)
}

>

<RecipeCard recipe={recipe}/>


</TinderCard>


))

}


</div>

)

}