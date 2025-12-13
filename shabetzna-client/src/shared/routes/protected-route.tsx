import { Navigate } from "react-router-dom";
import { getFromLocalStorage, USER_TOKEN_KEY } from "../local-storage";

interface Props {
  redirectPath?: string;
  children?: React.ReactNode;
}

const ProtectedRoute = ({
  redirectPath = "/unauthorized",
  children,
}: Props) => {
  const userToken = getFromLocalStorage(USER_TOKEN_KEY);

  if (!userToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
