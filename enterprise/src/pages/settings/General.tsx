import { Building2Icon, MailIcon, LinkIcon, PlusIcon } from "lucide-react";
import { Link, Button } from "@nextui-org/react";

const General = () => {
  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      <h1 className="text-3xl">General</h1>
      <div className="flex flex-row items-center justify-start w-full h-28 pt-8 gap-8">
        <div className="flex flex-row items-start justify-start w-[20%] h-full gap-2">
          <Building2Icon size={28} />
          <h1 className="text-base">Company Name</h1>
        </div>
        <div className="flex flex-row items-start justify-start w-[30%] gap-3 h-full">
          <p className="text-xl pt-1">Scudderia Ferrari</p>
        </div>
        <div className="flex flex-row items-start justify-start w-[20%] gap-3 h-full p-1">
          <Button size="sm" variant="light" className="flex flex-row">
            <PlusIcon size={24} className="text-slate-400" />
            <Link className="text-slate-400"> Update Profile</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start w-full h-28 pt-8 gap-8">
        <div className="flex flex-row items-start justify-start w-[20%] h-full gap-2">
          <MailIcon size={28} />
          <h1 className="text-base">Email</h1>
        </div>
        <div className="flex flex-row items-start justify-start w-1/2  gap-3 h-full">
          <Link href="#" className="text-xl pt-1">ScudderiaFerrari@gmail.com</Link>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start w-full h-28 pt-8 gap-8">
        <div className="flex flex-row items-start justify-start w-[20%] h-full gap-2">
          <LinkIcon size={28} />
          <h1 className="text-base">Website</h1>
        </div>
        <div className="flex flex-row items-start justify-start w-1/2  gap-3 h-full">
          <Link showAnchorIcon={true} href="#" className="text-xl pt-1">ScudderiaFerrari.com</Link>
        </div>
      </div>

    </div>
  )
};

export default General;
