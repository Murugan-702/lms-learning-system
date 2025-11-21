import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCourse } from "@/feautres/courses/courseService";
import  { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const DeleteCoursePage = () =>{
    const {courseId} = useParams();
    const[pending,startTransition] = useTransition();
    const navigate = useNavigate();
    
    console.log(courseId)

    const onSubmit = () =>{
           startTransition(
              async() =>{
                 const res = await tryCatch(deleteCourse(courseId as string));
                 if(res.data?.status === 'success'){
                   toast.success(res.data.message);
                   navigate("/admin/courses");
                 }
                 else{
                  toast.error(res.data?.message);
                 }
              }
           )
    }
    
    return(
        <div className="max-w-xl mx-auto w-full">
          <Card className="mt-32">
            <CardHeader>
                <CardTitle>Are you sure you want to delete this course?</CardTitle>
                <CardDescription>This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <Link className={buttonVariants({
                    variant:"outline"
                })} to="/admin/courses">
                Cancel
                </Link>
                <Button variant="destructive" onClick={onSubmit} disabled={pending}>
                      {
                        pending ? <><Loader2 className="animate-spin size-4"/> Deleting...</> : <>
                        <Trash2 className="sizer-4"/> Delete</>
                      }
                </Button>
            </CardContent>
          </Card>
        </div>
    )
}
export default DeleteCoursePage;