import { Input } from "@heroui/input";

const Info = ({
  companyName,
  setCompanyName,
}: {
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-16">
      <h2>
        Welcome to Scriptopia Enterprise. <br /> Let's get you started.
      </h2>
      <p className="opacity-50 mt-1">First, tell us about your organization.</p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Organization Name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Info;
