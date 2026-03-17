import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const projects = [
  {
    id: "123",
    name: "Project1",
    date: "1.1.10",
    permissions: { read: [{ email: "a@gmail.com", givenBy: "23@gmail.com", lastUpdated: "12.2.12" }], write: [{ email: "b@gmail.com", givenBy: "23@gmail.com", lastUpdated: "12.2.12" }] },
  },
  {
    id: "1233",
    name: "Project2",
    date: "1.1.10",
    permissions: { read: [{ email: "a@gmail.com", givenBy: "23@gmail.com", lastUpdated: "12.2.12" }], write: [{ email: "b@gmail.com", givenBy: "23@gmail.com", lastUpdated: "12.2.12" }] },
  },
];

const ProjectsDisp = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="pt-6 flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <NavLink to={`${project.id}`}>
              <Button>View</Button>
            </NavLink>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsDisp;
