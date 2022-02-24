import { lazy, Suspense } from "react";
import Layout from "./layout/admin/Layout";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<p>loading ...</p>}>
      <Component {...props} />
    </Suspense>
  );

// LANDING PAGE
const Home = Loadable(lazy(() => import("./pages/landing/Home")));

const Signup = Loadable(lazy(() => import("./pages/auth/Signup")));
const Login = Loadable(lazy(() => import("./pages/auth/Login")));

const PrivacyPolicy = Loadable(
  lazy(() => import("./pages/others/PrivacyPolicy"))
);

// ADMIN PAGE
// const Dashboard = Loadable(lazy(() => import("./pages/admin/dashboard/Dashboard")));
const Contacts = Loadable(lazy(() => import("./pages/admin/contact/Contacts")));
const Contact = Loadable(lazy(() => import("./pages/admin/contact/Contact")));
const Tickets = Loadable(lazy(() => import("./pages/admin/tickets/Tickets")));
const Todos = Loadable(lazy(() => import("./pages/admin/todo/Todos")));
const Emails = Loadable(lazy(() => import("./pages/admin/emails/Emails")));
const CMS = Loadable(lazy(() => import("./pages/admin/cms/CMS")));

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
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "admin_dashboard",
    element: <Layout />,
    children: [
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "contacts/:id",
        element: <Contact />,
      },
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
        path: "cms",
        element: <CMS />,
      },
    ],
  },
  // {
  //     path: "*",
  //     element: <ErrorPage />,
  //   },
];

export default routes;
