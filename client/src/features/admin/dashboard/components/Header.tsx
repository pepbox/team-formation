import { EllipsisVertical, ChevronRight, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "../../auth/components/LogoutButton";
import useAdminSessionNavigate from "../../../../hooks/useAdminNavigate";
import { RootState } from "../../../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useFetchAllPlayersDataQuery, useFetchAllTeamsDataQuery } from "../../../session/sessionApi";
import { enrichData } from "../../../session/teamsPlayersSlice";

const Header = () => {
  const { sessionName } = useSelector((state: RootState) => state.session);
  const { user } = useSelector((state: RootState) => state.adminAuth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { adminSessionBasePath } = useAdminSessionNavigate();
  const dispatch = useDispatch();

  const { refetch: refetchPlayers } = useFetchAllPlayersDataQuery(undefined);
  const { refetch: refetchTeams } = useFetchAllTeamsDataQuery(undefined);

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
    window.open(`${adminSessionBasePath}/${path}`, "_blank");

    setIsDropdownOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchPlayers(),
        refetchTeams()
      ]);
      dispatch(enrichData());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20 py-5 gap-3 md:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div>
          <LogoutButton />
        </div>
      </div>
      <div className="px-4 md:px-20 py-3 flex flex-col md:flex-row items-center justify-between bg-[#fca71e]/10 gap-3 md:gap-0">
        <div className="flex items-center">
          <button
            className="hover:bg-gray-200/50 rounded-full p-2 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh players and teams data"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-lg md:text-xl font-bold text-center">
            {sessionName}
          </h1>
          <p className="text-sm md:text-base">Admin : {user?.name}</p>
        </div>
        <div className="relative self-end md:self-auto" ref={dropdownRef}>
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
