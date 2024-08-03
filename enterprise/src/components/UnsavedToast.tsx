import { RootState } from "@/@types/reducer";
import { setToastChanges } from "@/reducers/toastReducer";
import { Button } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";

const UnsavedToast = ({
  action,
  reset,
}: {
  action: () => unknown;
  reset?: Dispatch<SetStateAction<boolean>>;
}) => {
  const changes = useSelector((state: RootState) => state.toast.changes);
  const shake = useSelector((state: RootState) => state.toast.shake);

  const dispatch = useDispatch();

  return (
    <div
      className={`fixed z-50 ${
        changes ? "translate-y-0" : "translate-y-[100px]"
      } transition-all bottom-3 right-3 p-5 bg-card border rounded-xl w-[400px] flex items-center justify-between ${
        shake && "animate-shake drop-shadow-glow-red"
      }`}
    >
      <div>
        <p className="text-sm">Heads Up!</p>
        <p className="text-xs">You have unsaved changes</p>
      </div>
      <div className="flex gap-2">
        {reset && (
          <Button
            color="danger"
            variant="light"
            onClick={() => {
              reset((prev) => !prev);
              dispatch(setToastChanges(false));
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          color="success"
          variant="flat"
          onClick={() => {
            action();
            dispatch(setToastChanges(false));
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default UnsavedToast;
