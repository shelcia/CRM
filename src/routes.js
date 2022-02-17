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

// ADMIN PAGE
// const Dashboard = Loadable(lazy(() => import("./pages/admin/dashboard/Dashboard")));
const Contact = Loadable(lazy(() => import("./pages/admin/contact/Contact")));

const routes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "admin_dashboard",
    element: <Layout />,
    children: [
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
  // {
  //     path: "*",
  //     element: <ErrorPage />,
  //   },
];

export default routes;
