import { Route, Routes } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage/LandingPage"
import LandingLayout from "./layout/LandingLayout"
import AuthLayout from "./layout/AuthLayout"
import LoginPage from "./pages/LoginPage/LoginPage"
import VerifyRequestPage from "./pages/VerifyRequest/VerifyRequestPage"
import { Toaster } from "./components/ui/sonner"
import AdminLayout from "./layout/AdminLayout"
import AdminIndexPage from "./pages/admin/AdminPage"
import { CourseCreatePage } from "./pages/admin/courses/CourseCreatePage"
import { CoursePage } from "./pages/admin/courses/CoursePage"



const App = () => {
  return (
    <>
    <Toaster/>
    
     <Routes>
      <Route path="/" element={<LandingLayout><LandingPage/></LandingLayout>}/>
     <Route element={<AuthLayout/>}>
     <Route path="/login" element={<LoginPage/>}/>
     <Route path="/verify-request/:email" element={<VerifyRequestPage/>}/>
     </Route>
      <Route path="/" element={<AdminLayout/>}>
        <Route path="/admin" element={<AdminIndexPage/>}/>
        <Route path ="/admin/courses" element={<CoursePage/>}/>
        <Route path="/admin/courses/create" element={<CourseCreatePage/>}/>
      </Route>
     </Routes>
     </>
  )
}

export default App