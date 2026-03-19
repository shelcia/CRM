import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CustomTextField } from "@/components/CustomInputs";
import { apiProvider } from "@/services/utilities/provider";
import usePermissions from "@/hooks/usePermissions";

type Project = {
  _id: string;
  name: string;
  date: string;
  totalTasks: number;
  doneTasks: number;
};

const Todos = () => {
  const { has } = usePermissions();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiProvider.getAll("projects", controller.signal, true).then((res) => {
      if (Array.isArray(res)) setProjects(res);
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  const handleDelete = (id: string) => {
    apiProvider.remove("projects", id, "", true).then((res) => {
      if (res?.message === "Project deleted") {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success("Project deleted");
      } else {
        toast.error(res?.message ?? "Failed to delete project");
      }
    });
  };

  const handleCreate = (name: string) => {
    apiProvider.post("projects/", { name }, "", true).then((res) => {
      if (res?._id) {
        setProjects((prev) => [...prev, res]);
        setShowForm(false);
        toast.success("Project created");
      } else {
        toast.error(res?.message ?? "Failed to create project");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects</h2>
        {has("todos-edit") && (
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        )}
      </div>

      {showForm && (
        <NewProjectForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-4 flex flex-col gap-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-1.5 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {projects.map((project) => (
              <Card key={project._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-base leading-tight">{project.name}</h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {new Date(project.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    {has("todos-delete") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(project._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{project.totalTasks} task{project.totalTasks !== 1 ? "s" : ""}</span>
                      <span>{project.doneTasks}/{project.totalTasks} done</span>
                    </div>
                    <Progress
                      value={project.totalTasks > 0 ? (project.doneTasks / project.totalTasks) * 100 : 0}
                      className="h-1.5"
                    />
                  </div>
                  <NavLink to={`${project._id}`}>
                    <Button size="sm" className="w-full">Open Board</Button>
                  </NavLink>
                </CardContent>
              </Card>
            ))}
            {projects.length === 0 && !showForm && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="font-semibold">No projects yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create a project to start organizing work with a Kanban board.</p>
                </div>
                {has("todos-edit") && (
                  <Button size="sm" onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4" /> Create First Project
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Todos;

const NewProjectForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) => {
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Name is required"),
    }),
    onSubmit: (v) => onSubmit(v.name),
  });

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start max-w-sm">
      <div className="flex-1">
        <CustomTextField
          name="name"
          placeholder="Project name"
          values={values}
          handleChange={handleChange}
          touched={touched}
          errors={errors}
        />
      </div>
      <Button type="submit" size="sm">
        Create
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};
