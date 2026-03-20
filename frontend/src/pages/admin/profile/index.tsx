import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomTextField } from "@/components/custom";
import { Building2, ImagePlus, UserRound } from "lucide-react";
import { apiCompany } from "@/services/models/companyModel";
import { BASE_URL } from "@/services/api";

// Strip trailing /api to get the server origin for static assets
const SERVER_ORIGIN = BASE_URL.replace(/\/api$/, "");

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = localStorage.getItem("CRM-name") ?? "";
  const email = localStorage.getItem("CRM-email") ?? "";
  const role = localStorage.getItem("CRM-type") ?? "";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { errors, values, handleChange, handleSubmit, touched, setValues } =
    useFormik({
      initialValues: {
        name: "",
        number: "",
        cmail: "",
        address: "",
        website: "",
        companySize: "",
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required("Company name is required"),
        number: Yup.string(),
        cmail: Yup.string().email("Enter a valid email"),
        address: Yup.string(),
        website: Yup.string(),
        companySize: Yup.number().min(0).nullable(),
      }),
      onSubmit: (vals) => {
        setIsLoading(true);
        apiCompany.put!(vals, "", true).then((res) => {
          if (res && res._id) {
            toast.success("Company details updated");
          } else {
            toast.error(res?.error ?? "Failed to update company");
          }
          setIsLoading(false);
        });
      },
    });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleLogoUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("logo", file);
    setLogoUploading(true);
    apiCompany.postFormData!(form, "/logo", true).then((res) => {
      if (res?.logo) {
        setLogoUrl(res.logo);
        toast.success("Logo updated");
      } else {
        toast.error(res?.error ?? "Failed to upload logo");
      }
      setLogoUploading(false);
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    apiCompany.getAll!(controller.signal, true).then((res) => {
      if (res && res._id) {
        setValues({
          name: res.name ?? "",
          number: res.number ?? "",
          cmail: res.cmail ?? "",
          address: res.address ?? "",
          website: res.website ?? "",
          companySize: res.companySize ?? "",
        });
        if (res.logo) setLogoUrl(res.logo);
      }
    });
    return () => controller.abort();
  }, []);

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          View your account and manage company settings
        </p>
      </div>

      {/* Account Info (read-only) */}
      <Card>
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <UserRound className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Account</span>
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-lg">
                {initials || <UserRound className="h-7 w-7 text-primary/60" />}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
              <span className="inline-block text-xs font-medium bg-primary/10 text-primary rounded px-2 py-0.5 capitalize">
                {role}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Details (editable) */}
      <Card>
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Company Details</span>
        </div>
        <CardContent className="pt-6 space-y-6">
          {/* Logo upload */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {logoPreview || logoUrl ? (
                <img
                  src={logoPreview ?? `${SERVER_ORIGIN}${logoUrl}`}
                  alt="Company logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Company Logo</p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP or GIF — max 5 MB
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="size-4 mr-1.5" />
                  Choose file
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    size="sm"
                    loading={logoUploading}
                    onClick={handleLogoUpload}
                  >
                    Upload
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomTextField
              label="Company Name"
              name="name"
              placeholder="ex: Acme Corp"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              label="Phone"
              name="number"
              placeholder="ex: +1 555 000 0000"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              label="Company Email"
              name="cmail"
              placeholder="ex: hello@acme.com"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              label="Website"
              name="website"
              placeholder="ex: https://acme.com"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              label="Address"
              name="address"
              placeholder="ex: 123 Main St, New York"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
            />
            <CustomTextField
              label="Company Size"
              name="companySize"
              placeholder="ex: 200"
              values={values}
              handleChange={handleChange}
              touched={touched}
              errors={errors}
              type="number"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button loading={isLoading} onClick={() => handleSubmit()}>
          Save Changes
        </Button>
      </div>
    </section>
  );
};

export default Profile;
