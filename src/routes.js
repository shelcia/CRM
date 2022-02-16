import { lazy, Suspense } from "react";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<p>loading ...</p>}>
      <Component {...props} />
    </Suspense>
  );

// LANDING PAGE
const Home = Loadable(lazy(() => import("./pages/landing/Home")));

// ADMIN PAGE
// const Contact = Loadable(lazy(() => import("./pages/admin/contact/Contact")));

const routes = [
  {
    path: "",
    element: <Home />,
  },
  // {
  //     path: "*",
  //     element: <ErrorPage />,
  //   },
];

export default routes;
