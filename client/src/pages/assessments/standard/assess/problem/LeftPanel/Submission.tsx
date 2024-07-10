import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Submission as SubmissionType } from "../types";

const Submission = ({ submissions }: { submissions: SubmissionType[] }) => {
  return (
    <div className="p-2">
      <h6>Submissions</h6>

      {submissions.length !== 0 ? (
        <>
          <Table className="mt-5">
            <TableHeader>
              <TableColumn>Status</TableColumn>
              <TableColumn>Language</TableColumn>
              <TableColumn>Submitted</TableColumn>
              <TableColumn>Runtime</TableColumn>
              <TableColumn>Memory</TableColumn>
            </TableHeader>
            <TableBody>
              {submissions?.map((submission, index) => (
                <TableRow
                  key={index}
                  className="h-16 hover:bg-accent cursor-pointer duration-200 transition-colors rounded-lg"
                >
                  <TableCell
                    className={`${
                      submission?.status === "Accepted"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {submission?.status}
                  </TableCell>
                  <TableCell>{submission?.language}</TableCell>
                  <TableCell>{submission?.time}</TableCell>
                  <TableCell>{submission?.runtime}</TableCell>
                  <TableCell>{submission?.memory}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className=" text-center mt-10 text-gray-500">
          No submissions yet
        </div>
      )}
    </div>
  );
};

export default Submission;
