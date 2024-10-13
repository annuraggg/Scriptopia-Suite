/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouteError } from "react-router-dom";

const ErrorPage = ({
  statusCode = 500,
  message = "Internal Server Error",
  error,
}: {
  statusCode?: number;
  message?: string;
  error?: any;
}) => {
  const e: any = useRouteError();
  const env = import.meta.env.MODE;

  error && console.error(error);
  e && console.error(e);

  return (
    <div className="flex items-center justify-center h-[100vh]  w-[100vw] absolute top-0 left-0 loader z-50">
      <div className="flex flex-col items-center justify-center ">
        <p className="text-sm ">{e?.status || message}</p>

        <h1 className="text-3xl font-bold ">{e?.statusText || statusCode}</h1>

        <p
          className="text-sm mt-3 hover:underline cursor-pointer  text-warning-500 underline"
          onClick={() => window.history.back()}
        >
          {" "}
          Go Back{" "}
        </p>

        {env === "development" && e?.data && (
          <div className="p-5 text-xs border mt-5 rounded-lg">{e?.data}</div>
        )}

        {env === "development" && error?.message && (
          <div className="p-5 text-xs border mt-5 rounded-lg">
            {error?.message}
          </div>
        )}

        <p
        className="absolute bottom-5 text-xs"
        >For Support, Contact us at support@scriptopia.tech</p>
      </div>
    </div>
  );
};

export default ErrorPage;
