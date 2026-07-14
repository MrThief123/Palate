import {useNavigate,useParams} from "react-router-dom";


export default function Feedback(){

const navigate=useNavigate();

const {id}=useParams();


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

How was it?

</h1>


<textarea

className="
border
w-full
mt-5
p-3
"

placeholder="
Any feedback?
Too spicy?
Too difficult?
"

/>


<button

onClick={()=>
navigate("/discover")
}

className="
mt-5
bg-black
text-white
px-5
py-3
rounded-xl
">

Submit Feedback

</button>


</div>

)

}