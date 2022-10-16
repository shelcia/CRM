import React from "react";
import { lazy, Suspense } from "react";
import Layout from "./layout/admin/Layout";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<p>loading ...</p>}>
      <Component {...props} />
    </Suspense>
  );

// LANDING PAGE
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
const Todos = Loadable(lazy(() => import("./pages/admin/todos/Todos")));
const Emails = Loadable(lazy(() => import("./pages/admin/emails/Emails")));
const CDA = Loadable(lazy(() => import("./pages/admin/cda/CDA")));

const ErrorPage = Loadable(lazy(() => import("./pages/others/ErrorPage")));

const routes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
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
