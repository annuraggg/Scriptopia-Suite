import { Posting } from "@shared-types/Posting";

// @ts-expect-error - will be used in the future <- remove this comment when you start using this function
const Main = ({ posting }: { posting: Posting }) => {
  return <div className="p-10 py-5">d</div>;
};

export default Main;
