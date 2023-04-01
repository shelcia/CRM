/* eslint-disable react/display-name */
import React from "react";
import { lazy, Suspense } from "react";
import Layout from "./layout/admin/Layout";
import HomeLayout from "./layout/home/Layout";
import AuthLayout from "./layout/auth/Layout";
// import Todos from "./pages/admin/todos/Projects";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<p>loading ...</p>}>
      <Component {...props} />
    </Suspense>
  );

// LANDING PAGEll
const Home = Loadable(lazy(() => import("./pages/home/Homepage")));

const Signup = Loadable(lazy(() => import("./pages/home/Signup")));
const Login = Loadable(lazy(() => import("./pages/home/Login")));

// const PrivacyPolicy = Loadable(
//   lazy(() => import("./pages/others/PrivacyPolicy"))
// );

// ADMIN PAGE
// const Dashboard = Loadable(lazy(() => import("./pages/admin/dashboard/Dashboard")));
const Contacts = Loadable(
  lazy(() => import("./pages/admin/contacts/Contacts"))
);
// const Contact = Loadable(lazy(() => import("./pages/admin/contact/Contact")));
const Tickets = Loadable(lazy(() => import("./pages/admin/tickets/Tickets")));

const Projects = Loadable(lazy(() => import("./pages/admin/todos/Projects")));
const Todos = Loadable(lazy(() => import("./pages/admin/todos/Todos")));

const Emails = Loadable(lazy(() => import("./pages/admin/emails/Emails")));
const CDA = Loadable(lazy(() => import("./pages/admin/cda/CDA")));

const ErrorPage = Loadable(lazy(() => import("./pages/others/ErrorPage")));

const routes = [
  {
    path: "",
    element: (
      <HomeLayout>
        <Home />
      </HomeLayout>
    ),
  },
  {
    path: "signup",
    element: (
      <AuthLayout>
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: "login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  // {
  //   path: "privacy-policy",
  //   element: <PrivacyPolicy />,
  // },
  {
    path: "admin_dashboard",
    element: <Layout />,
    children: [
      {
        path: "contacts",
        element: <Contacts />,
      },
      // {
      //   path: "contacts/:id",
      //   element: <Contact />,
      // },
      {
        path: "tickets",
        element: <Tickets />,
      },
      {
        path: "todos",
        element: <Projects />,
      },
      {
        path: "todos/:id",
        element: <Todos />,
      },
      {
        path: "emails",
        element: <Emails />,
      },
      {
        path: "cda",
        element: <CDA />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
