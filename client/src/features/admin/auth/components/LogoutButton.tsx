import { LogOut } from "lucide-react";
import { useLogoutAdminMutation } from "../adminAuthApi";

const LogoutButton = () => {
  const [logout, { isLoading }] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center border border-red-400 text-red-400 cursor-pointer gap-2 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut />
      {isLoading ? "Logging out..." : "Log Out"}
    </button>
  );
};

export default LogoutButton;
