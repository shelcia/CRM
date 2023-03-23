import React from "react";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const ProjectsDisp = () => {
  const projects = [
    {
      id: "123",
      name: "Project1",
      date: "1.1.10",
      permissions: {
        read: [
          {
            email: "a@gmail.com",
            givenBy: "23@gmail.com",
            lastUpdated: "12.2.12",
          },
        ],
        write: [
          {
            email: "b@gmail.com",
            givenBy: "23@gmail.com",
            lastUpdated: "12.2.12",
          },
        ],
      },
    },
    {
      id: "1233",
      name: "Project2",
      date: "1.1.10",
      permissions: {
        read: [
          {
            email: "a@gmail.com",
            givenBy: "23@gmail.com",
            lastUpdated: "12.2.12",
          },
        ],
        write: [
          {
            email: "b@gmail.com",
            givenBy: "23@gmail.com",
            lastUpdated: "12.2.12",
          },
        ],
      },
    },
  ];
  return (
    <Grid container spacing={2}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} lg={4} key={project.id}>
          <Card>
            <CardContent>
              <Typography component="h1" variant="h5">
                {project.name}
              </Typography>
              <NavLink to={`${project.id}`}>
                <Button variant="contained">View</Button>
              </NavLink>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectsDisp;
