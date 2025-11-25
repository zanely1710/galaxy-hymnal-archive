import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Galaxy3D from "@/components/Galaxy3D";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent relative">
      <Galaxy3D />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-950/30 to-blue-900/40 backdrop-blur-sm pointer-events-none" />
      <div className="text-center relative z-10">
        <h1 className="mb-4 text-4xl font-bold text-white">404</h1>
        <p className="mb-4 text-xl text-white/80">Oops! Page not found</p>
        <a href="/" className="text-blue-400 underline hover:text-blue-300">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
