import { useEffect, useState, type ReactNode } from "react";
import type { AdminCourseSingularType } from "../types/AdminCourseType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewChapterModal from "./NewChapterModal";
import { DndContext, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors, type DragEndEvent, type DraggableSyntheticListeners } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/hooks/dispatchHook";
import { reorderChapters } from "@/feautres/chapters/chapterSlice";


interface iAppProps {
  data: AdminCourseSingularType;
}
interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}
const CourseStructure = ({data}:iAppProps) =>{
  const dispatch = useAppDispatch();
  console.log(data);
     const intialItems =
    data?.chapters?.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true, // default chapters to open
      lessons: chapter?.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
      const [items, setItems] = useState(intialItems);
      
  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen:
          prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })),
      })) || [];
      return updatedItems;
    });
  },[data]);
  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }
  function handleDragEnd(event: DragEndEvent) {
    console.log(event);
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = active.data.current?.type as "chapter" | "lesson";
    const courseId = data._id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        toast.error("Could not determine the chapter for reordering");
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not find chapter old/new index for reordering");
        return;
      }
      const reorderLocalChapters = arrayMove(items, oldIndex, newIndex);
      const updatedChapterForState = reorderLocalChapters.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );

      const previousItems = [...items];
      setItems(updatedChapterForState);

      if (courseId) {
        const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
          chapterId: chapter.id,
          position: chapter.order,
        }));

           const reorderPromise = () =>
         {
               return dispatch(reorderChapters(chaptersToUpdate)).unwrap();
         }
        toast.promise(reorderPromise(), {
          loading: "Reordering Chapters...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder chapters.";
          },
         });
      }
      return;
    }

    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = active.data.current?.chapterId;
      console.log("drag", chapterId);
      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "Lesson move between different chapters or Invalid ChapterId is not allowed"
        );
        return;
      }
      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (chapterIndex === -1) {
        toast.error("Could not find chapter for lesson");
        return;
      }

      const chapterToUpdate = items[chapterIndex];

      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not find lesson for ordering");
        return;
      }

      const reordedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonForState = reordedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));

      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };

      const previousItems = [...items];

      setItems(newItems);

      if (courseId) {
        const lessonToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));

        // const reorderLessonsPromise = () =>
        //   reorderLessons(chapterId, lessonToUpdate, courseId);
        // toast.promise(reorderLessonsPromise(), {
        //   loading: "Reordering Lessons...",
        //   success: (result) => {
        //     if (result.status === "success") {
        //       return result.message;
        //     }
        //     throw new Error(result.message);
        //   },
        //   error: () => {
        //     setItems(previousItems);
        //     return "Failed to reorder Lessons";
        //   },
        // });
      }
      return;
    }
  }
  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapterId === chapter.id
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
    return(
      <>
      <DndContext  collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
           <NewChapterModal courseId={data._id}/> 
        </CardHeader>
         <CardContent className="space-y-8">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                data={{ type: "chapter" }}
                id={item.id}
                key={item.id}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="flex items-center"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>
                        {/* <DeleteChapter courseId={data.id} chapterId={item.id}/> */}
                      </div>

                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm ">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        {...lessonListeners}
                                        variant="ghost"
                                        size="icon"
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        to={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>

                                  {/* <DeleteLesson courseId={data.id} chapterId={item.id} lessonId={lesson.id}/> */}
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                          {/* <NewLessonModal chapterId={item.id} courseId={data.id}/> */}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
      </DndContext>

      
      </>
    )
}
export default CourseStructure;