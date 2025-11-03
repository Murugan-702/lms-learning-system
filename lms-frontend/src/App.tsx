import { Route, Routes } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage/LandingPage"
import LandingLayout from "./layout/LandingLayout"
import AuthLayout from "./layout/AuthLayout"
import LoginPage from "./pages/LoginPage/LoginPage"
import VerifyRequestPage from "./pages/VerifyRequest/VerifyRequestPage"
import { Toaster } from "./components/ui/sonner"



const App = () => {
  return (
    <>
    <Toaster/>
    
     <Routes>
      <Route path="/" element={<LandingLayout><LandingPage/></LandingLayout>}/>
      <Route path ="/login" element={<AuthLayout><LoginPage/></AuthLayout>}/>
      <Route path="/verify-request/:email" element={<AuthLayout><VerifyRequestPage/></AuthLayout>}/>
     </Routes>
     </>
  )
}

export default App