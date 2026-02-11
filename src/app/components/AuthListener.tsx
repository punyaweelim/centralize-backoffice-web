import { useEffect } from "react";
import { authStorage } from "@/utils/auth";

export default function AuthListener({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "refresh_token" && e.newValue === null) {
        authStorage.clearAll();
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return <>{children}</>;
}
