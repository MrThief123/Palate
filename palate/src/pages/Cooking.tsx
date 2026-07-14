import { useParams,useNavigate } from "react-router-dom";
import { recipes } from "../data/recipe";


export default function Cooking(){

const {id}=useParams();

const navigate=useNavigate();


const recipe =
recipes.find(r=>r.id===id);


return (

<div className="p-10 max-w-xl mx-auto">


<h1 className="text-4xl font-bold">

{recipe?.name}

</h1>


<h2 className="text-xl mt-5">
Ingredients
</h2>


<ul>

{
recipe?.ingredients.map(i=>(

<li key={i}>
{i}
</li>

))
}

</ul>



<h2 className="text-xl mt-5">
Instructions
</h2>


<ol>

{
recipe?.instructions.map(i=>(

<li key={i}>
{i}
</li>

))
}

</ol>


<button

onClick={()=>
navigate(`/feedback/${id}`)
}

className="
mt-10
bg-black
text-white
px-5
py-3
rounded-xl
">

Finished Cooking

</button>


</div>

)

}