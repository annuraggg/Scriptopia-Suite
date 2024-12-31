import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";

const confirmDelete = (action: () => Promise<void>) => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const t = toast.warning(
    <div className="flex items-center justify-between w-full max-h-5">
      <TriangleAlert className="mr-3" size={40} />
      <div className="w-full text-xs">Are you sure?</div>
      <div className="flex gap-3 h-5 items-center w-fit mr-5">
        <button
          className="bg-white bg-opacity-10 px-5 min-h-full h-[30px] rounded-lg min-w-fit"
          onClick={() => toast.dismiss(t)}
        >
          No
        </button>
        <button
          className="bg-white bg-opacity-10 px-5 min-h-full h-[30px] rounded-lg min-w-fit"
          onClick={async () => {
            toast.loading("Deleting", { id: t });
            try {
              await delay(1000);
              await action();
              toast.success("Deleted Successfully", { id: t });
            } catch (error) {
              toast.error("Deletion failed. Please try again.", { id: t });
            }
          }}
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default confirmDelete;
