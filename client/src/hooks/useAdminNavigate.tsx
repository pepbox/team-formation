import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

const useAdminSessionNavigate = () => {
  const navigate = useNavigate();
  const { sessionId } = useSelector((state: RootState) => state.session);

  const adminSessionBasePath = `/admin/${sessionId}`;

  const adminNavigate = (path: string) => {
    navigate(`${adminSessionBasePath}/${path}`);
  };
  return { navigate: adminNavigate, adminSessionBasePath };
};

export default useAdminSessionNavigate;
