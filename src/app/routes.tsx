import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Scanner } from "./components/Scanner";
import { Community } from "./components/Community";
import { Progress } from "./components/Progress";
import { Profile } from "./components/Profile";
import { CheckIn } from "./components/CheckIn";
import { LoginPage } from "./components/auth/LoginPage";
import { SignUpPage } from "./components/auth/SignUpPage";
import { AuthGuard } from "./components/auth/AuthGuard";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { WorkoutPlanner } from "./components/WorkoutPlanner";
import { DailyTrackerPage } from "./components/DailyTrackerPage";
import { EducationHub } from "./components/education/EducationHub";
import { CourseDetail } from "./components/education/CourseDetail";
import { LessonPlayer } from "./components/education/LessonPlayer";
import { ReferralsHub } from "./components/referrals/ReferralsHub";
import { OmegaAudit } from "./components/omega/OmegaAudit";
import { DistributorHub } from "./components/distributor/DistributorHub";
import { MindHub } from "./components/mind/MindHub";
import { SpiritHub } from "./components/spirit/SpiritHub";
import { BrainDump } from "./components/brain/BrainDump";
import { WorkoutSessionPage } from "./components/workout/WorkoutSessionPage";
import { ZenoChat } from "./components/zeno/ZenoChat";

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
      { path: "checkin", Component: CheckIn },
      { path: "profile", Component: Profile },
      { path: "workout", Component: WorkoutPlanner },
      { path: "daily-tracker", Component: DailyTrackerPage },
      { path: "education", Component: EducationHub },
      { path: "education/:courseId", Component: CourseDetail },
      { path: "education/lesson/:lessonId", Component: LessonPlayer },
      { path: "referrals", Component: ReferralsHub },
      { path: "omega", Component: OmegaAudit },
      { path: "distributor", Component: DistributorHub },
      { path: "mind", Component: MindHub },
      { path: "spirit", Component: SpiritHub },
      { path: "brain-dump", Component: BrainDump },
      { path: "workout/session/:sessionId", Component: WorkoutSessionPage },
      { path: "zeno", Component: ZenoChat },
    ],
  },
]);
