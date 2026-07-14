import { useNavigate } from "react-router-dom";


export default function Onboarding(){

const navigate=useNavigate();


return (

<div className="
max-w-xl
mx-auto
p-10
">


<h1 className="
text-3xl
font-bold
">

Tell us about you

</h1>


<div className="space-y-5 mt-8">


<input
className="border p-3 w-full rounded"
placeholder="Cooking skill"
/>


<input
className="border p-3 w-full rounded"
placeholder="Favourite cuisines"
/>


<input
className="border p-3 w-full rounded"
placeholder="Cooking time"
/>


<input
className="border p-3 w-full rounded"
placeholder="Food allergies"
/>



</div>


<button

onClick={()=>
navigate("/discover")
}

className="
mt-10
bg-black
text-white
px-6
py-3
rounded-xl
">

Start Cooking

</button>


</div>

)

}