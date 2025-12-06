import Navbar from "@/pages/LandingPage/components/Navbar";
import { Outlet } from "react-router-dom";


const LandingLayout = () =>{
     return(
        <div>
            <Navbar/>
            <main className="container mx-auto px-4">
                <Outlet/>
            </main>
        </div>
     )
}
export default LandingLayout;