import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, FolderKanban } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  CustomTextField,
  PageSpinner,
  CustomEmptyState,
  PageHeader,
  DeleteIconButton,
  CustomModal,
  AddPrimaryButton,
} from "@/components/custom";
import { apiProvider } from "@/services/utilities/provider";
import usePermissions from "@/hooks/usePermissions";
import { Project } from "../types";

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
    <section className="space-y-6">
      <PageHeader
        title="Projects"
        description="Organise work with Kanban boards"
        actions={
          has("todos-edit") && (
            <AddPrimaryButton
              text="New Project"
              onClick={() => setShowForm(true)}
            />
          )
        }
      />

      <CustomModal
        title="New Project"
        size="sm"
        open={showForm}
        onOpenChange={(open) => !open && setShowForm(false)}
      >
        <NewProjectForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </CustomModal>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-5 pb-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-base leading-tight">
                      {project.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created{" "}
                      {new Date(project.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {has("todos-delete") && (
                    <DeleteIconButton
                      className="h-7 w-7 shrink-0"
                      onClick={() => handleDelete(project._id)}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.totalTasks} task
                  {project.totalTasks !== 1 ? "s" : ""} · {project.doneTasks}{" "}
                  done
                </p>
                <NavLink to={`${project._id}`}>
                  <Button size="sm" className="w-full">
                    Open Board
                  </Button>
                </NavLink>
              </CardContent>
            </Card>
          ))}
          {projects.length === 0 && (
            <CustomEmptyState
              className="col-span-full py-20"
              icon={FolderKanban}
              title="No projects yet"
              description="Create a project to start organizing work with a Kanban board."
              action={
                has("todos-edit") && (
                  <AddPrimaryButton
                    text="Create First Project"
                    onClick={() => setShowForm(true)}
                  />
                )
              }
            />
          )}
        </div>
      )}
    </section>
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <CustomTextField
        name="name"
        placeholder="Project name"
        values={values}
        handleChange={handleChange}
        touched={touched}
        errors={errors}
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Create
        </Button>
      </div>
    </form>
  );
};
