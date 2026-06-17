import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: Props) {

  const adminKbn =
    sessionStorage.getItem("adminKbn");

  if (!adminKbn) {
    return <Navigate to="/user-login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;