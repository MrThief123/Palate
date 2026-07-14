import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";


import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Discover from "./pages/Discover";
import Cooking from "./pages/Cooking";
import Feedback from "./pages/Feedback";


export default function App(){


return (

<BrowserRouter>

<Routes>


<Route path="/" element={<Login/>}/>

<Route 
path="/onboarding"
element={<Onboarding/>}
/>


<Route 
path="/discover"
element={<Discover/>}
/>


<Route 
path="/cooking/:id"
element={<Cooking/>}
/>


<Route 
path="/feedback/:id"
element={<Feedback/>}
/>


</Routes>

</BrowserRouter>


)

}