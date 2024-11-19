import { Button } from "@nextui-org/react";

const UnsavedToast = ({
  action,
  reset,
  shake,
}: {
  action: () => void;
  reset?: () => void;
  shake: boolean;
}) => {
  return (
    <div
      className={`fixed z-50 transition-all bottom-3 right-3 p-5 bg-card border rounded-xl w-[400px] flex items-center justify-between
      ${shake && "animate-shake drop-shadow-glow-red"}
      `}
    >
      <div>
        <p className="text-sm">Heads Up!</p>
        <p className="text-xs">You have unsaved changes</p>
      </div>

      <div className="flex gap-2">
        {reset && (
          <Button color="danger" variant="light" onClick={reset}>
            Cancel
          </Button>
        )}
        <Button color="success" variant="flat" onClick={action}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default UnsavedToast;
