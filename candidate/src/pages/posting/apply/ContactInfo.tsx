import { Input } from "@heroui/react";

interface ContactInfoProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
}

const ContactInfo = ({
  name,
  setName,
  phone,
  setPhone,
  email,
  website,
  setWebsite,
}: ContactInfoProps) => {
  return (
    <div className="flex flex-cols-2 items-center justify-between h-full w-full flex-wrap">
      <div className="flex flex-col items-start justify-center gap-2 w-[48%] mt-5">
        <label className="text-base"> Name *</label>
        <Input
          placeholder="eg. Doe"
          className="w-full rounded-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-start justify-center gap-2 w-[48%] mt-5">
        <label className="text-base">Email Address *</label>
        <Input
          placeholder="eg. johndoe@example.com"
          className="w-full rounded-sm"
          value={email}
          isDisabled
        />
      </div>

      <div className="flex flex-col items-start justify-center gap-2 w-[48%] mt-5">
        <label className="text-base">Phone No *</label>
        <Input
          placeholder="eg. 123-456-789"
          className="w-full rounded-sm"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-start justify-center gap-2 w-[48%] mt-5">
        <label className="text-base">Website</label>
        <Input
          placeholder="eg. portfolio.example.com"
          className="w-full rounded-sm"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ContactInfo;
