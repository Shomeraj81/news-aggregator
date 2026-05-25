"use client";

import { useEffect } from "react";

import { useRouter }
from "next/navigation";

import { useAuth }
from "@/context/AuthContext";

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const {
    isLoggedIn,
    loading,
  } = useAuth();

  useEffect(() => {
    if (
      !loading &&
      !isLoggedIn
    ) {
      router.push("/login");
    }
  }, [
    isLoggedIn,
    loading,
    router,
  ]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;