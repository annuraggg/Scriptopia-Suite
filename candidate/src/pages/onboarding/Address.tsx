import { Textarea } from "@heroui/react";

const Address = ({
  address,
  setAddress,
}: {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-10">
      <p className="opacity-50 mt-1">
        Next, tell us about your address so we can find postings near you.
      </p>

      <div className="mt-5 w-[500px]">
        <Textarea
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Address;
