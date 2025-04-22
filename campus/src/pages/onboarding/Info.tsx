import { Input } from "@nextui-org/react";

const Info = ({
  instituteName,
  setInstituteName,
}: {
  instituteName: string;
  setInstituteName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-10">
      <h2>
        Welcome to Scriptopia Campus. <br /> Let's get you started.
      </h2>
      <p className="opacity-50 mt-1">First, tell us about your institute.</p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Institute Name"
          type="text"
          value={instituteName}
          onChange={(e) => setInstituteName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Info;