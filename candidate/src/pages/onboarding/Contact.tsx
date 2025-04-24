import { Input } from "@heroui/react";

const Contact = ({
  email,
  phone,
  setPhone,
}: {
  email: string;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-10">
      <p className="opacity-50 mt-1">
        Next, tell us about how we can contact you.
      </p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Your Email"
          type="email"
          value={email}
          isReadOnly
          description="This field cannot be changed"
        />
        <Input
          label="Your Phone"
          type="tel"
          className="mt-5"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Contact;
