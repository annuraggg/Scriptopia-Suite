import { SignUp as SignUpBox } from "@clerk/clerk-react";

const SignUp = () => {
  return (
    <div className="flex items-center justify-center p-20 ">
      <img
        src="./logo1080_transparent_white_large.png"
        className="w-10 h-10 absolute top-10 left-10 cursor-pointer"
        onClick={() => window.location.assign("/")}
      />
      <SignUpBox forceRedirectUrl="/dashboard" />
    </div>
  );
};

export default SignUp;
