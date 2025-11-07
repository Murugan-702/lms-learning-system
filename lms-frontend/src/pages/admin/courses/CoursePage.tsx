import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getMyCourses } from "@/feautres/courses/courseThunk";
import { useAppDispatch, useAppSelector } from "@/hooks/dispatchHook";
import { Link } from "react-router-dom";
import { AdminCourseCard } from "../components/AdminCourseCard";

export const CoursePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [courses, setCourses] =useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await dispatch(getMyCourses());
      console.log(res);
      setCourses(res.payload.data || []); // optional
    };
    fetchCourses();
  }, [dispatch]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} to="/admin/courses/create">
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
        {courses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          courses.map((course) => (
             <AdminCourseCard data={course}/>
          ))
        )}
      </div>
    </>
  );
};
