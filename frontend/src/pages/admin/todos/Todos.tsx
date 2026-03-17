import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomTextField } from "@/components/CustomInputs";
import { apiProvider } from "@/services/utilities/provider";

type Project = {
  _id: string;
  name: string;
  date: string;
};

const Todos = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    apiProvider.getAll("projects/", controller.signal, true).then((res) => {
      if (Array.isArray(res)) setProjects(res);
    });
    return () => controller.abort();
  }, []);

  const handleDelete = (id: string) => {
    apiProvider.remove("projects/", id, "", true).then((res) => {
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
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" /> New Project
        </Button>
      </div>

      {showForm && (
        <NewProjectForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project._id}>
            <CardContent className="pt-6 flex flex-col gap-3">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <div className="flex gap-2">
                <NavLink to={`${project._id}`} className="flex-1">
                  <Button className="w-full">Open Board</Button>
                </NavLink>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(project._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && !showForm && (
          <p className="text-muted-foreground col-span-full text-sm">
            No projects yet. Create one to get started.
          </p>
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
