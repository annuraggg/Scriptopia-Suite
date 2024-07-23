const Message = ({
  name,
  message,
  sender,
  timestamp,
}: {
  name: string;
  message: string;
  sender: string;
  timestamp: string;
}) => {
  return (
    <div
      className={`p-2 border rounded-xl w-[70%] mt-2 relative ${
        sender === "you" ? "bg-green-700 float-right" : "bg-zinc-700 float-left"
      }`}
    >
      <p className=" text-xs absolute opacity-70 text-[10px]">{name}</p>
      <p className="mt-4">{message}</p>
      <sub className="absolute bottom-1 right-2 text-xs">{timestamp}</sub>
    </div>
  );
};

export default Message;
