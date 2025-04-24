import { DatePicker, Input, Radio, RadioGroup } from "@heroui/react";
import { CalendarDate, today } from "@internationalized/date";

const Info = ({
  name,
  setName,
  dob,
  setDob,
  gender,
  setGender,
}: {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  dob: CalendarDate | undefined;
  setDob: React.Dispatch<React.SetStateAction<CalendarDate | undefined>>;
  gender: string;
  setGender: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-10">
      <h2>
        Welcome to Scriptopia Candidate. <br /> Let's get you started.
      </h2>
      <p className="opacity-50 mt-1">First, tell us about yourself.</p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Your Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          description={
            <p className="text-red-500">
              This field is cannot be changed later
            </p>
          }
        />

        <DatePicker
          label="Date of Birth"
          className="mt-3"
          value={dob}
          onChange={(date) => setDob(date!)}
          maxValue={today("IST")}
          description={
            <p className="text-red-500">
              This field is cannot be changed later
            </p>
          }
        />

        <RadioGroup
          label="Gender"
          orientation="horizontal"
          className="mt-3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          description={
            <p className="text-red-500">
              This field is cannot be changed later
            </p>
          }
        >
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
          <Radio value="other">Other</Radio>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Info;
