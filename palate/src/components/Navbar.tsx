import { Link } from "react-router-dom";


export default function Navbar(){

return (

<nav className="
w-full
p-5
flex
justify-between
bg-white
shadow
">

<h1 className="font-bold text-xl">
🍴 Palate
</h1>


<div className="space-x-5">

<Link to="/discover">
Discover
</Link>


<Link to="/onboarding">
Profile
</Link>

</div>

</nav>

)

}