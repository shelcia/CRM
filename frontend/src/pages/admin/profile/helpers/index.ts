import * as Yup from "yup";

export const emptyCompanyProfile = {
  name: "",
  number: "",
  cmail: "",
  address: "",
  website: "",
  companySize: "",
};

export const companyProfileValidationSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  number: Yup.string(),
  cmail: Yup.string().email("Enter a valid email"),
  address: Yup.string(),
  website: Yup.string(),
  companySize: Yup.number().min(0).nullable(),
});
