import { RootState } from "@/@types/reducer";
import { Button } from "@nextui-org/react";
import { useSelector } from "react-redux";

const UnsavedToast = ({ action }: { action: () => unknown }) => {
  const changes = useSelector((state: RootState) => state.toast.changes);
  const shake = useSelector((state: RootState) => state.toast.shake);

  return (
    <div
      className={`fixed z-50 ${
        changes ? "translate-y-0" : "translate-y-[70px]"
      } transition-all bottom-3 right-3 p-5 bg-card border rounded-xl w-[350px] flex items-center justify-between ${
        shake && "animate-shake drop-shadow-glow-red"
      }`}
    >
      <div>
        <p className="text-sm">Heads Up!</p>
        <p className="text-xs">You have unsaved changes</p>
      </div>
      <Button color="success" variant="flat" onClick={action}>
        Save Changes
      </Button>
    </div>
  );
};

export default UnsavedToast;
