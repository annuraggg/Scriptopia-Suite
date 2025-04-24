/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@heroui/react";
import { useRouteError } from "react-router-dom";

// Friendly error messages mapping
const friendlyErrorMessages: Record<number, string> = {
  404: "Oops! We can't find the page you're looking for.",
  500: "We're experiencing some issues on our end. Hang tight!",
  403: "Access denied! You don't have permission to view this page.",
  401: "You need to log in to access this page.",
  502: "Our servers hit a snag. We're fixing it!",
  503: "The service is temporarily unavailable. Please try again later!",
  418: "I'm a teapot. No, seriously. I can't brew coffee!",
  400: "Something went wrong. Check your request and try again.",
  408: "The request timed out. Let's give it another go!",
  429: "Too many requests! Give us a moment to catch up.",
};

const ErrorPage = (props: {
  statusCode?: number;
  message?: string;
  error?: any;
}) => {
  const { statusCode = 500, message = "Something went wrong", error } = props;
  const e: any = useRouteError();
  const env = import.meta.env.MODE;

  error && console.error(error);
  e && console.error(e);

  // Determine the error details
  const resolvedStatusCode = e?.status || statusCode;
  const resolvedMessage = friendlyErrorMessages[resolvedStatusCode] || message;
  const is404 = resolvedStatusCode === 404;

  return (
    <div className="flex h-[100vh] w-[100vw] bg-gray-100 text-gray-800">
      {/* Main error section */}
      <div className="flex flex-col items-center justify-center w-3/4 p-8">
        {/* Error Code */}
        <h1
          className={`text-5xl font-bold ${
            is404 ? "text-yellow-600" : "text-red-600"
          } m-0 p-0`}
        >
          {resolvedStatusCode}
        </h1>
        {/* Error Title */}
        <h2 className="text-xl font-semibold mb-2">
          {is404 ? "Page Not Found" : e?.statusText || "Error"}
        </h2>
        {/* Friendly Error Message */}
        <p className="text-lg text-gray-700 text-center">{resolvedMessage}</p>

        {/* Suggestion for 404 errors */}
        {is404 && (
          <div className="text-center mt-4">
            <p className="text-gray-600">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Button onPress={() => window.location.href = "/dashboard"} className="mt-5">Go Back to Home</Button>
          </div>
        )}

        {/* Additional details for development */}
        {env === "development" && !is404 && (
          <div className="bg-gray-200 text-gray-700 text-sm rounded-lg p-4 mt-8 max-w-xl w-full">
            <h3 className="font-semibold mb-2">Debug Information</h3>
            {e?.data && (
              <pre className="mb-2 overflow-auto">
                {JSON.stringify(e?.data, null, 2)}
              </pre>
            )}
            {error?.message && (
              <pre className="overflow-auto">
                {JSON.stringify(error?.message, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Subtle footer */}
        <footer className="mt-4 text-xs text-gray-500">
          {env === "development"
            ? "You're in development mode. See the debug information above."
            : "If the issue persists, please contact support."}
        </footer>
      </div>

      {/* Dev Console Section */}
      {env === "development" && (
        <div className="w-1/4 bg-black text-white p-4 overflow-y-auto">
          <h2 className="text-lg font-bold border-b border-gray-700 pb-2">
            Dev Console
          </h2>
          <pre className="text-xs mt-2">
            {error
              ? JSON.stringify(error, null, 2)
              : "No additional error info"}
          </pre>
          <pre className="text-xs mt-2">
            {e ? JSON.stringify(e, null, 2) : "No route error info"}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ErrorPage;
