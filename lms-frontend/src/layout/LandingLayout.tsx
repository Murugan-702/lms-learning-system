import Navbar from "@/pages/LandingPage/components/Navbar";
import type React from "react";


const LandingLayout = ({children}:{children:React.ReactNode}) =>{
     return(
        <div>
            <Navbar/>
            <main className="container mx-auto px-4">{children}</main>
        </div>
     )
}
export default LandingLayout;