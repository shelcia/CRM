import * as Yup from "yup";

export const emptyCompany = {
  name: "",
  website: "",
  number: "",
  cmail: "",
  address: "",
  companySize: "",
};

export const companyValidationSchema = Yup.object({
  name: Yup.string().required("Company name is required"),
  website: Yup.string(),
  number: Yup.string(),
  cmail: Yup.string().email("Enter a valid email"),
  address: Yup.string(),
  companySize: Yup.string(),
});
