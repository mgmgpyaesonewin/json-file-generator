"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>{children}</main>
  );
};

// Use withAuthenticator to enforce authentication for all child routes
export default withAuthenticator(AuthenticatedLayout);