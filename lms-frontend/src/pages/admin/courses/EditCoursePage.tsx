import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourseById } from "@/feautres/courses/courseThunk";
import { useAppDispatch } from "@/hooks/dispatchHook";
import CourseStructure from "../components/CourseStructure"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


const EditCoursePage = () =>{
    const {courseId} = useParams();
    const [data,setData] = useState({});
    const dispatch = useAppDispatch();
    const adminGetCourses = async (courseId: string | undefined) =>{
       const res =  await dispatch(getCourseById(courseId as string));
       return res.payload?.data;
    }
    useEffect(()=>{
             adminGetCourses(courseId as string).then((course)=>{
                 setData(course);
             });
    },[courseId]);
    
  

   
  return(
    <div>
         <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
         <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid grid-cols-2 w-full ">
                         <TabsTrigger value="basic-info">
                            Basic Info
                         </TabsTrigger>
                         <TabsTrigger value="course-structure">
                            Course Structure
                         </TabsTrigger>
                     </TabsList>
                     <TabsContent value="basic-info">
                          <Card>
                            <CardHeader>

                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>Provide the basic information about the course</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* <EditCourseForm data={data}/> */}
                            </CardContent>
                          </Card>
                     </TabsContent>
                     <TabsContent value="course-structure">
                          <Card>
                            <CardHeader>

                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>
                                Here you can update your Course Structure
                            </CardDescription>
                            </CardHeader>
                            <CardContent>
                             <CourseStructure data={data}/>
                            </CardContent>
                          </Card>
                     </TabsContent>
         </Tabs>
    </div>
  )
}
export default EditCoursePage;