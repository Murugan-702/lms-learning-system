import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLesson } from "@/feautres/lessons/lessonsService";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, type LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const NewLessonModal = ({ chapterId }: { chapterId: string }) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  

  
  

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      chapterId : chapterId
    },
  });
  

  const onSubmit = (values: LessonSchemaType) => {
    
    startTransition(
      async () => {
      const { data: result, error } = await tryCatch(
        createLesson({title:values.name,chapterId:values.chapterId}
        )
      );

      if (error) {
        toast.error("Something went wrong");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message || "Chapter created");
        form.reset();
        setOpen(false);
      } else {
        toast.error(result?.message || "Failed to create chapter");
      }
       setTimeout(() => {
      window.location.reload();
    }, 1000)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-center gap-1">
          <Plus className="size-4" /> New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Lesson</DialogTitle>
          <DialogDescription>
            What would you like to name your lesson?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button  type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLessonModal;
