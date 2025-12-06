import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourseById } from "@/feautres/courses/courseService";
import CourseStructure from "../components/CourseStructure"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AdminCourseSingularType } from "@/types/courseType";
import { EditCourseForm } from "../components/EditCourseForm";



const EditCoursePage = () =>{
    const {courseId} = useParams();
    const [data,setData] = useState<AdminCourseSingularType>();
    
    const adminGetCourses = async (courseId: string | undefined) =>{
       const res =  await getCourseById(courseId as string);
       return res.data;
    }
    useEffect(()=>{
             adminGetCourses(courseId as string).then((course)=>{
                 setData(course);
             });
    },[courseId]);
    console.log(data);
      if (!data) {
        return <p className="text-center py-10">Loading course…</p>;
    }

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
                                <EditCourseForm data={data as AdminCourseSingularType}/>
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
                             <CourseStructure data={data as AdminCourseSingularType}/>
                            </CardContent>
                          </Card>
                     </TabsContent>
         </Tabs>
    </div>
  )
}
export default EditCoursePage;