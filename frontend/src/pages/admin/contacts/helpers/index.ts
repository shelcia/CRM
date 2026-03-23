import * as Yup from "yup";

export const makeEmptyContact = () => ({
  name: "",
  email: "",
  number: "",
  company: "",
  jobTitle: "",
  priority: "low",
  companySize: "",
  probability: "0.5",
  status: "new",
  lastActivity: new Date().toISOString(),
});

export const contactValidationSchema = Yup.object().shape({
  name: Yup.string().required("Contact name is required"),
  email: Yup.string().email("Enter a valid email"),
  number: Yup.string(),
  company: Yup.string(),
  jobTitle: Yup.string(),
  priority: Yup.string(),
  companySize: Yup.number().min(0).nullable(),
  probability: Yup.string(),
  status: Yup.string().required("Status is required"),
});
