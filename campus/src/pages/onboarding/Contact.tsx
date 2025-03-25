import { Input } from "@nextui-org/react";

const Contact = ({
  instituteEmail,
  setInstituteEmail,
  instituteWebsite,
  setInstituteWebsite,
  instituteAddress,
  setInstituteAddress,
  instituteStreetAddress,
  setInstituteStreetAddress,
  instituteCity,
  setInstituteCity,
  instituteState,
  setInstituteState,
  instituteCountry,
  setInstituteCountry,
  instituteZipCode,
  setInstituteZipCode,
}: {
  instituteEmail: string;
  setInstituteEmail: React.Dispatch<React.SetStateAction<string>>;
  instituteWebsite: string;
  setInstituteWebsite: React.Dispatch<React.SetStateAction<string>>;
  instituteAddress: string;
  setInstituteAddress: React.Dispatch<React.SetStateAction<string>>;
  instituteStreetAddress: string;
  setInstituteStreetAddress: React.Dispatch<React.SetStateAction<string>>;
  instituteCity: string;
  setInstituteCity: React.Dispatch<React.SetStateAction<string>>;
  instituteState: string;
  setInstituteState: React.Dispatch<React.SetStateAction<string>>;
  instituteCountry: string;
  setInstituteCountry: React.Dispatch<React.SetStateAction<string>>;
  instituteZipCode: string;
  setInstituteZipCode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-5">
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
        <Input
          label="Street Address"
          type="text"
          className="mt-5"
          value={instituteStreetAddress}
          onChange={(e) => setInstituteStreetAddress(e.target.value)}
        />
        <div className="flex gap-3">
          <Input
            label="City"
            type="text"
            className="mt-5"
            value={instituteCity}
            onChange={(e) => setInstituteCity(e.target.value)}
          />
          <Input
            label="State"
            type="text"
            className="mt-5"
            value={instituteState}
            onChange={(e) => setInstituteState(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Input
            label="Country"
            type="text"
            className="mt-5"
            value={instituteCountry}
            onChange={(e) => setInstituteCountry(e.target.value)}
          />
          <Input
            label="Zip Code"
            type="number"
            className="mt-5"
            value={instituteZipCode}
            onChange={(e) => setInstituteZipCode(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
