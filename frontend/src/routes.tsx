/* eslint-disable react/display-name */
import { lazy, Suspense, ComponentType } from "react";
import Layout from "./layout/admin/Layout";
import PublicLayout from "./layout/public/Layout";
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

// LANDING PAGE
const Home = Loadable(lazy(() => import("./pages/home")));

const Signup = Loadable(lazy(() => import("./pages/auth/signup")));
const Login = Loadable(lazy(() => import("./pages/auth/login")));
const Verification = Loadable(lazy(() => import("./pages/auth/verification")));
const EmailVerify = Loadable(lazy(() => import("./pages/auth/email-verify")));
const ForgetPassword = Loadable(lazy(() => import("./pages/auth/forget-pwd")));
const ResetPwd = Loadable(lazy(() => import("./pages/auth/reset-pwd")));

// ADMIN PAGE
const AddCompany = Loadable(lazy(() => import("./pages/admin/add-company")));
const Users = Loadable(lazy(() => import("./pages/admin/users")));
const AddUser = Loadable(lazy(() => import("./pages/admin/users/add")));
const EditUser = Loadable(lazy(() => import("./pages/admin/users/edit")));

const Profile = Loadable(lazy(() => import("./pages/admin/profile")));

const Contacts = Loadable(lazy(() => import("./pages/admin/contacts")));
const AddContact = Loadable(lazy(() => import("./pages/admin/contacts/add")));
const Tickets = Loadable(lazy(() => import("./pages/admin/tickets")));
const AddTicket = Loadable(lazy(() => import("./pages/admin/tickets/add")));

const Projects = Loadable(lazy(() => import("./pages/admin/projects")));
const Todos = Loadable(lazy(() => import("./pages/admin/projects/tasks")));

const Emails = Loadable(lazy(() => import("./pages/admin/emails")));
const Pipeline = Loadable(lazy(() => import("./pages/admin/pipeline")));
const Dashboard = Loadable(lazy(() => import("./pages/admin/dashboard")));

const ErrorPage = Loadable(lazy(() => import("./pages/others/ErrorPage")));

const routes = [
  {
    path: "",
    element: (
      <PublicLayout>
        <Home />
      </PublicLayout>
    ),
  },
  {
    path: "",
    element: (
      <PublicLayout card>
        <Outlet />
      </PublicLayout>
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
