import { Input, Select, SelectItem } from "@nextui-org/react";

interface ContactInfoProps {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  website: string;
  setWebsite: React.Dispatch<React.SetStateAction<string>>;
}

const ContactInfo = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  email,
  setEmail,
  website,
  setWebsite,
}: ContactInfoProps) => {
  return (
    <div className="flex flex-cols-2 items-center justify-between h-full w-full gap-6">
      <div className="flex flex-col items-start justify-center gap-1 w-full h-full">
        <div className="flex flex-col items-start justify-center gap-2 w-full h-full">
          <label className="text-base">First Name *</label>
          <Input
            placeholder="eg. John"
            className="w-full rounded-sm"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-2 w-full h-full">
          <label className="text-base">Phone Country Code *</label>
          <Select
            placeholder="Select Country Code"
            className="w-full rounded-sm"
            selectedKeys={[countryCode]}
            onSelectionChange={(e) => setCountryCode(e.toString())}
          >
            <SelectItem key="US">+1 (United States)</SelectItem>
            <SelectItem key="CA">+1 (Canada)</SelectItem>
            <SelectItem key="GB">+44 (United Kingdom)</SelectItem>
            <SelectItem key="AU">+61 (Australia)</SelectItem>
            <SelectItem key="IN">+91 (India)</SelectItem>
          </Select>
        </div>
        <div className="flex flex-col items-start justify-center gap-2 w-full h-full">
          <label className="text-base">Email Address *</label>
          <Input
            placeholder="eg. johndoe@example.com"
            className="w-full rounded-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
        <div className="flex flex-col items-start justify-center gap-2 w-full h-full">
          <label className="text-base">Last Name *</label>
          <Input
            placeholder="eg. Doe"
            className="w-full rounded-sm"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-2 w-full h-full">
          <label className="text-base">Phone No *</label>
          <Input
            placeholder="eg. 123-456-789"
            className="w-full rounded-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-2 w-full h-full">
          <label className="text-base">Website</label>
          <Input
            placeholder="eg. portfolio.example.com"
            className="w-full rounded-sm"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
