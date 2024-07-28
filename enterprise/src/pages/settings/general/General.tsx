import { Image } from "@nextui-org/image";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/@types/reducer";
import { Upload } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ax from "@/config/axios";
import { toast } from "sonner";

const General = () => {
  const [companyName, setCompanyName] = useState<string>("Scriptopia");
  const [logo, setLogo] = useState<string>();
  const [companyWebsite, setCompanyWebsite] = useState<string>(
    "https://scriptopia.tech"
  );
  const [companyEmail, setCompanyEmail] = useState<string>(
    "contact@scriptopia.tech"
  );

  const org = useSelector((state: RootState) => state.organization);

  const { getToken } = useAuth();
  const axios = ax(getToken);

  useEffect(() => {
    axios
      .post("organizations/get/settings")
      .then((res) => {
        setCompanyName(res.data.data.name);
        setCompanyEmail(res.data.data.email);
        setCompanyWebsite(res.data.data.website);
        setLogo(res.data.data.logo || "/defaultOrgLogo.png");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error Fetching Settings");
      });
  }, []);

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
          </Button>
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-10">
          <p className="w-[40%]">Company Name</p>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-3">
          <p className="w-[40%]">Company Email</p>
          <Input
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-[50%] items-center mt-3">
          <p className="w-[40%]">Company Website</p>
          <Input
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
          />
        </div>

        <Button
          className="absolute bottom-10 right-10"
          variant="flat"
          color="success"
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default General;
