import { Input } from "@heroui/input";

const Contact = ({
  companyEmail,
  setCompanyEmail,
  companyWebsite,
  setCompanyWebsite,
}: {
  companyEmail: string;
  setCompanyEmail: React.Dispatch<React.SetStateAction<string>>;
  companyWebsite: string;
  setCompanyWebsite: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-16">
      <p className="opacity-50 mt-1">
        Next, tell us about how we can contact you.
      </p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Organization Email"
          type="email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
        />
        <Input
          label="Organization Website"
          type="url"
          className="mt-5"
          value={companyWebsite}
          onChange={(e) => setCompanyWebsite(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Contact;
