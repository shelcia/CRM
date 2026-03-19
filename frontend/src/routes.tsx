/* eslint-disable react/display-name */
import { lazy, Suspense, ComponentType } from "react";
import Layout from "./layout/admin/Layout";
import HomeLayout from "./layout/home/Layout";
import AuthLayout from "./layout/auth/Layout";
import { Navigate, Outlet } from "react-router-dom";
import usePermissions from "./hooks/usePermissions";

const RequirePermission = ({ permission }: { permission: string }) => {
  const { has } = usePermissions();
  return has(permission) ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const Loadable =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => (
    <Suspense fallback={<p>loading ...</p>}>
      <Component {...props} />
    </Suspense>
  );

// LANDING PAGEll
const Home = Loadable(lazy(() => import("./pages/home/Homepage")));

const Signup = Loadable(lazy(() => import("./pages/auth/Signup")));
const Login = Loadable(lazy(() => import("./pages/auth/Login")));
const Verification = Loadable(lazy(() => import("./pages/auth/Verification")));
const EmailVerify = Loadable(lazy(() => import("./pages/auth/EmailVerify")));
const ForgetPassword = Loadable(
  lazy(() => import("./pages/auth/ForgetPassword")),
);
const ResetPwd = Loadable(lazy(() => import("./pages/auth/ResetPwd")));

// ADMIN PAGE
const AddCompany = Loadable(
  lazy(() => import("./pages/admin/company/AddCompany")),
);
const Users = Loadable(lazy(() => import("./pages/admin/users/Users")));
const AddUser = Loadable(lazy(() => import("./pages/admin/users/AddUser")));
const EditUser = Loadable(lazy(() => import("./pages/admin/users/EditUser")));

const Profile = Loadable(lazy(() => import("./pages/admin/profile/Profile")));

const Contacts = Loadable(
  lazy(() => import("./pages/admin/contacts/Contacts")),
);
const AddContact = Loadable(
  lazy(() => import("./pages/admin/contacts/AddContact")),
);
const Tickets = Loadable(lazy(() => import("./pages/admin/tickets/Tickets")));
const AddTicket = Loadable(lazy(() => import("./pages/admin/tickets/AddTicket")));

const Projects = Loadable(lazy(() => import("./pages/admin/todos/Projects")));
const Todos = Loadable(lazy(() => import("./pages/admin/todos/Todos")));

const Emails = Loadable(lazy(() => import("./pages/admin/emails/Emails")));
const Pipeline = Loadable(lazy(() => import("./pages/admin/pipeline/Pipeline")));
const Dashboard = Loadable(lazy(() => import("./pages/admin/Dashboard")));

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
    path: "",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "verification",
        element: <Verification />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/email-verification/:id",
        element: <EmailVerify />,
      },
      {
        path: "/reset-password/:id",
        element: <ResetPwd />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "add-company",
        element: <AddCompany />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "users",
        element: <RequirePermission permission="users-view" />,
        children: [{ index: true, element: <Users /> }],
      },
      {
        path: "users/add-user",
        element: <RequirePermission permission="users-edit" />,
        children: [{ index: true, element: <AddUser /> }],
      },
      {
        path: "users/edit-user/:id",
        element: <RequirePermission permission="users-edit" />,
        children: [{ index: true, element: <EditUser /> }],
      },
      {
        path: "contacts",
        element: <RequirePermission permission="contacts-view" />,
        children: [{ index: true, element: <Contacts /> }],
      },
      {
        path: "contacts/add-contact",
        element: <RequirePermission permission="contacts-edit" />,
        children: [{ index: true, element: <AddContact /> }],
      },
      {
        path: "tickets",
        element: <RequirePermission permission="tickets-view" />,
        children: [{ index: true, element: <Tickets /> }],
      },
      {
        path: "tickets/add-ticket",
        element: <RequirePermission permission="tickets-edit" />,
        children: [{ index: true, element: <AddTicket /> }],
      },
      {
        path: "todos",
        element: <RequirePermission permission="todos-view" />,
        children: [{ index: true, element: <Todos /> }],
      },
      {
        path: "todos/:id",
        element: <RequirePermission permission="todos-view" />,
        children: [{ index: true, element: <Projects /> }],
      },
      {
        path: "emails",
        element: <RequirePermission permission="admin" />,
        children: [{ index: true, element: <Emails /> }],
      },
      {
        path: "pipeline",
        element: <RequirePermission permission="contacts-view" />,
        children: [{ index: true, element: <Pipeline /> }],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
