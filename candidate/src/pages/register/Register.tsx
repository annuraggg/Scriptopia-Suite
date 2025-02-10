import ax from "@/config/axios";
import { useAuth } from "@clerk/clerk-react";
import {
  Button,
  DatePicker,
  Input,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import { parseDate } from "@internationalized/date";

const Register = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(parseDate("2024-04-04"));
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const submitData = () => {
    axios
      .post("candidates/candidate", {
        name,
        dob: dob.toDate("UTC"),
        gender,
        email,
        phone,
        address,
      })
      .then((res) => {
        console.log(res.data);
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-5">
      <h2>Welcome to Scriptopia Candidates</h2>
      <p>To get Started, please fill in the following details.</p>

      <div className="flex gap-3">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DatePicker label="DOB" value={dob} onChange={setDob} />
      </div>
      <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)}>
        <Radio value={"male"}>Male</Radio>
        <Radio value={"female"}>Female</Radio>
      </RadioGroup>

      <div className="flex gap-3">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <Textarea
        label="Address"
        className="max-w-72"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <Button variant="flat" color="success" onPress={submitData}>
        Start
      </Button>
    </div>
  );
};

export default Register;
