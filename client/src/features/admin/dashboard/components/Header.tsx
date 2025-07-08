import { EllipsisVertical, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "../../auth/components/LogoutButton";
import useAdminSessionNavigate from "../../../../hooks/useAdminNavigate";
import { RootState } from "../../../../app/store";
import { useSelector } from "react-redux";

const Header = () => {
  const { sessionName } = useSelector((state: RootState) => state.session);
  const { user } = useSelector((state: RootState) => state.adminAuth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { navigate } = useAdminSessionNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center px-20 py-5">
        <div>
          <h1 className="text-2xl font-bold ">Admin Dashboard</h1>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
      <div className="px-20 py-3 flex items-center justify-between bg-[#fca71e]/10">
        <div />
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-center">{sessionName}</h1>
          <p>Admin : {user?.name}</p>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            className="hover:bg-gray-200/50 rounded-full p-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <EllipsisVertical />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => handleMenuClick("meet-the-teams")}
              >
                Show Players
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                onClick={() => handleMenuClick("team-captains")}
              >
                Show Captains
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
