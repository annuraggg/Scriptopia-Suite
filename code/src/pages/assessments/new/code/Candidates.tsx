import { Button, Input, Select, SelectItem } from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useState } from "react";
import { motion } from "framer-motion";

const Candidates = ({
  access,
  setAccess,
  candidates,
  setCandidates,
}: {
  access: string;
  setAccess: (access: string) => void;
  candidates: { name: string; email: string }[];
  setCandidates: (
    candidates:
      | { name: string; email: string }[]
      | ((
          prev: { name: string; email: string }[]
        ) => { name: string; email: string }[])
  ) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const addCandidates = () => {
    setNameError("");
    setEmailError("");

    if (!name.trim()) {
      setNameError("Name cannot be blank");
      return;
    }

    if (!email.trim()) {
      setEmailError("Email cannot be blank");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    setCandidates((prev) => [
      ...prev,
      {
        name: name.trim(),
        email: email.trim(),
      },
    ]);

    setName("");
    setEmail("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-5 flex-wrap items-start w-full justify-between">
        <Select
          label="Access"
          size="sm"
          className="w-[400px]"
          selectedKeys={[access]}
          onChange={(e) => setAccess(e.target.value)}
        >
          <SelectItem key="all">
            Allow Access to All Candidates
          </SelectItem>
          <SelectItem key="specific">
            Allow Access to Specific Candidates
          </SelectItem>
        </Select>

        {access === "specific" && (
          <div className="flex gap-5 items-start justify-between">
            <Button className="w-[100px]">Import CSV</Button>
            <Button className="w-[100px]">Export CSV</Button>
            <div className="flex gap-2 flex-col w-[500px]">
              <div className="flex gap-2">
                <Input
                  className="w-full"
                  placeholder="Enter Candidate Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  errorMessage={nameError}
                  isInvalid={!!nameError}
                />
                <Input
                  className="w-full"
                  placeholder="Enter Candidate Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  errorMessage={emailError}
                  isInvalid={!!emailError}
                />
              </div>
              <Button className="w-full" onClick={addCandidates}>
                Add Candidate
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        {access === "all" && (
          <div>
            <p className="text-sm text-gray-400 mb-16">
              All Candidates are allowed to take the assessment.
            </p>
          </div>
        )}

        {access === "specific" && (
          <div>
            <Table>
              <TableHeader>
                <TableColumn>Sr No</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        className="w-[100px]"
                        onClick={() => {
                          setCandidates((prev) => [
                            ...prev.filter((c) => c.name !== candidate.name),
                          ]);
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Candidates;