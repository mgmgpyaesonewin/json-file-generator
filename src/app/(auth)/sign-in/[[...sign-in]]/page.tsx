import { SignIn } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Page() {
  return (
      <>
        <ErrorBoundary>
          <SignIn path="/sign-in" routing="path" />
        </ErrorBoundary>
      </>
  )
}