import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../../../app/store";
import useAdminSessionNavigate from "../../../../hooks/useAdminNavigate";

const AdminProtectedRoute = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminAuth
  );
  const { adminSessionBasePath } = useAdminSessionNavigate();

  if (!isAuthenticated) {
    return <Navigate to={`${adminSessionBasePath}/login`} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
