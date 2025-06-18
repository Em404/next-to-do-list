import { SignUp } from "@clerk/nextjs";
import React from "react";

function page() {
  return (
    <div className="flex justify-center items-center mt-12">
      <SignUp forceRedirectUrl="/to-do-list"/>
    </div>
  );
}

export default page;
