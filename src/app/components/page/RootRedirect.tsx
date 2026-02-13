import { Navigate } from "react-router-dom";
import { authStorage } from "@/utils/auth";

const RootRedirect = () => {
  const token = authStorage.getAccessToken();  
  return token
    ? <Navigate to="/users" replace />
    : <Navigate to="/login" replace />;
};

export default RootRedirect;