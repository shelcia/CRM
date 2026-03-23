import * as Yup from "yup";

export const emptyTicket = {
  title: "",
  contact: "",
  email: "",
  category: "technical",
  priority: "medium",
  status: "open",
  assignedTo: "",
  description: "",
};

export const ticketValidationSchema = Yup.object().shape({
  title: Yup.string().required("Ticket title is required"),
  contact: Yup.string().required("Contact name is required"),
  email: Yup.string().email("Enter a valid email"),
  category: Yup.string().required("Category is required"),
  priority: Yup.string().required("Priority is required"),
  status: Yup.string().required("Status is required"),
  assignedTo: Yup.string(),
  description: Yup.string(),
});
