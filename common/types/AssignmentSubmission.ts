interface AssignmentSubmission {
  _id?: string;
  assignmentId: string;
  candidateId: string;
  postingId: string;
  fileSubmission?: string;
  textSubmission?: string;
  linkSubmission?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default AssignmentSubmission;
