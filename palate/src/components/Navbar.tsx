import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";


export default function Navbar(){

    const navigate = useNavigate();


    function handleLogout(){

        console.log(
            "LOGOUT_CLICKED"
        );


        // Later:
        // clear auth token
        // clear user context
        // call backend logout


        navigate("/");

    }


    return (

        <nav className="navbar">


            <h1 className="navbar-logo">
                🍴 Palate
            </h1>



            <div className="navbar-links">


                <Link to="/discover">
                    Discover
                </Link>


                <Link to="/onboarding">
                    Profile
                </Link>


                <button

                    onClick={handleLogout}

                    className="logout-button"

                >

                    Logout

                </button>


            </div>


        </nav>

    )

}