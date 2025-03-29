import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Submission as SubmissionType } from "@shared-types/Submission";

const Submission = ({
  submissions,
  loading,
}: {
  submissions: SubmissionType[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-2">
      <h6>Submissions</h6>

      {submissions?.length !== 0 ? (
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
                      submission?.status === "SUCCESS"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {submission?.status}
                  </TableCell>
                  <TableCell>{submission?.language}</TableCell>
                  <TableCell>
                    {submission?.createdAt ? new Date(submission?.createdAt).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {(submission?.avgTime * 10).toFixed(2) + " ms"}
                  </TableCell>
                  <TableCell>
                    {submission?.avgMemory.toFixed(2) + " MB"}
                  </TableCell>
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
