import { Input } from "@nextui-org/react";

const Contact = ({
  email,
  setEmail,
  phone,
  setPhone,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="pt-16">
      <p className="opacity-50 mt-1">
        Next, tell us about how we can contact you.
      </p>

      <div className="mt-5 w-[500px]">
        <Input
          label="Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
