import { Input } from "@nextui-org/react";

const Contact = ({
  instituteEmail,
  setInstituteEmail,
  instituteWebsite,
  setInstituteWebsite,
  instituteAddress,
  setInstituteAddress,
}: {
  instituteEmail: string;
  setInstituteEmail: React.Dispatch<React.SetStateAction<string>>;
  instituteWebsite: string;
  setInstituteWebsite: React.Dispatch<React.SetStateAction<string>>;
  instituteAddress: string;
  setInstituteAddress: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-16">
      <p className="opacity-50 mt-1">
        Next, tell us about how we can contact your institute.
      </p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Institute Email"
          type="email"
          value={instituteEmail}
          onChange={(e) => setInstituteEmail(e.target.value)}
        />
        <Input
          label="Institute Website"
          type="url"
          className="mt-5"
          value={instituteWebsite}
          onChange={(e) => setInstituteWebsite(e.target.value)}
        />
        <Input
          label="Institute Address"
          type="text"
          className="mt-5"
          value={instituteAddress}
          onChange={(e) => setInstituteAddress(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Contact;