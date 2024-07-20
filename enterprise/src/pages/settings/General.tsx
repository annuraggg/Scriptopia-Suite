import { Building2Icon, MailIcon, LinkIcon } from "lucide-react";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

const General = () => {
  const [companyName, setCompanyName] = useState<string>("Scriptopia");
  const [companyWebsite, setCompanyWebsite] = useState<string>(
    "https://scriptopia.tech"
  );
  const [companyEmail, setCompanyEmail] = useState<string>(
    "contact@scriptopia.tech"
  );

  return (
    <div className="">
      <h4>General Settings</h4>
      <div className="mt-5 flex flex-col gap-5 w-[50%]">
        <div className="flex justify-between mt-5">
          <p className="w-[40%]">Company Name</p>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            startContent={<Building2Icon />}
          />
        </div>

        <div className="flex justify-between">
          <p className="w-[40%]">Company Website</p>
          <Input
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            startContent={<LinkIcon />}
          />
        </div>

        <div className="flex justify-between">
          <p className="w-[40%]">Company Email</p>
          <Input
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            startContent={<MailIcon />}
          />
        </div>
      </div>

      <Button variant="flat" className="mt-10 float-right" color="success">
        Save Changes
      </Button>
    </div>
  );
};

export default General;
