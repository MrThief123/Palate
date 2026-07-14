import { useNavigate } from "react-router-dom";


export default function Login(){

const navigate = useNavigate();


return (

<div className="
h-screen
flex
items-center
justify-center
">


<div className="
text-center
">


<h1 className="
text-5xl
font-bold
">
🍴 Palate
</h1>


<p className="mt-5">
Your AI cooking companion
</p>


<button

onClick={()=>
navigate("/onboarding")
}

className="
mt-10
bg-black
text-white
px-8
py-3
rounded-xl
">

Continue

</button>


</div>


</div>

)

}