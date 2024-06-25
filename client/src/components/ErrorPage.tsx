const ErrorPage = ({
  statusCode = 500,
  message = "Internal Server Error",
}: {
  statusCode?: number;
  message?: string;
}) => {
  return (
    <div className="flex items-center justify-center h-[100vh]  w-[100vw] absolute top-0 left-0 loader z-50">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Error {statusCode}</h1>
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-3 text-gray-400">Please try again later.</p>
      </div>
    </div>
  );
};

export default ErrorPage;
