import { SignOutButton, UserButton } from "@clerk/clerk-react";
import React from "react";

const Home = () => {
  return (
    <div>
      <SignOutButton />
      <UserButton />
    </div>
  );
};

export default Home;
