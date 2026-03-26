import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Scanner } from "./components/Scanner";
import { Community } from "./components/Community";
import { Progress } from "./components/Progress";
import { Profile } from "./components/Profile";
import { LoginPage } from "./components/auth/LoginPage";
import { SignUpPage } from "./components/auth/SignUpPage";
import { AuthGuard } from "./components/auth/AuthGuard";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";

function Protected({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/onboarding",
    element: <Protected><OnboardingFlow /></Protected>,
  },
  {
    path: "/",
    element: <Protected><Layout /></Protected>,
    children: [
      { index: true, Component: Dashboard },
      { path: "scanner", Component: Scanner },
      { path: "community", Component: Community },
      { path: "progress", Component: Progress },
      { path: "profile", Component: Profile },
    ],
  },
]);
