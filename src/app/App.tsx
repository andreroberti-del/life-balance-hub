import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./routes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '16px',
              border: '1px solid #DDD6FE',
            },
            className: 'm7-toast',
          }}
        />
      </LanguageProvider>
    </AuthProvider>
  );
}
