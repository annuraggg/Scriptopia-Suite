import { SignIn as SignInBox } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <img
        src="./logo1080_transparent_white_large.png"
        className="w-10 h-10 absolute top-10 left-10 cursor-pointer"
        onClick={() => window.location.assign("/")}
      />
      <SignInBox forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default SignIn;
