import { Drive as DriveSchema } from "@shared-types/Drive";

// @ts-expect-error - will be used in the future <- remove this comment when you start using this function
const Main = ({ drive }: { drive: DriveSchema }) => {
  return <div className="p-10 py-5">d</div>;
};

export default Main;
