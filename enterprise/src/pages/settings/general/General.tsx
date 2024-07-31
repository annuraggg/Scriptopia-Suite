import { Image } from "@nextui-org/image";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/@types/reducer";
import { Upload } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const General = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [logo, setLogo] = useState<string>("/defaultOrgLogo.png");
  const [companyWebsite, setCompanyWebsite] = useState<string>("");
  const [companyEmail, setCompanyEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const org = useSelector((state: RootState) => state.organization);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("organizations/settings");
      setCompanyName(res.data.data.name || "");
      setCompanyEmail(res.data.data.email || "");
      setCompanyWebsite(res.data.data.website || "");
      setLogo(res.data.data.logo || "/defaultOrgLogo.png");
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post("organizations/settings", {
        name: companyName,
        email: companyEmail,
        website: companyWebsite,
        logo: logo
      });
      toast.success("Settings updated successfully");
      setHasChanges(false);
    } catch (err) {
      console.log(err);
      toast.error("Error updating settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setHasChanges(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-5 ml-5">
        <Breadcrumbs>
          <BreadcrumbItem href={"/" + org._id}>Organization</BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/settings"}>
            Settings
          </BreadcrumbItem>
          <BreadcrumbItem href={"/" + org._id + "/settings/general"}>
            General
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div className="p-5 px-10">
        <div className="w-fit">
          <Image src={logo} width={200} height={200} />
          <Button className="mt-2 w-full" variant="ghost">
            <Upload /> Change Logo
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: "none" }}
            />
          </Button>
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-10">
          <p className="w-[40%]">Company Name</p>
          <Input
            value={companyName}
            onChange={handleInputChange(setCompanyName)}
          />
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-3">
          <p className="w-[40%]">Company Email</p>
          <Input
            value={companyEmail}
            onChange={handleInputChange(setCompanyEmail)}
          />
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-3">
          <p className="w-[40%]">Company Website</p>
          <Input
            value={companyWebsite}
            onChange={handleInputChange(setCompanyWebsite)}
          />
        </div>

        <Button
          className="absolute bottom-10 right-10"
          variant="flat"
          color="success"
          onClick={handleSave}
          isLoading={saving}
          isDisabled={!hasChanges || saving}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default General;