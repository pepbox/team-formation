import { useSelector } from "react-redux";
import { 
  selectEnrichedPlayers, 
  selectEnrichedTeams, 
  selectTeamsPlayersLoading,
  selectTeamsPlayersError 
} from "./teamsPlayersSlice";

/**
 * Custom hook to access enriched teams and players data
 * This hook provides a centralized way to access the enriched data throughout the application
 */
export const useTeamsPlayersData = () => {
  const enrichedPlayers = useSelector(selectEnrichedPlayers);
  const enrichedTeams = useSelector(selectEnrichedTeams);
  const isLoading = useSelector(selectTeamsPlayersLoading);
  const error = useSelector(selectTeamsPlayersError);

  return {
    players: enrichedPlayers,
    teams: enrichedTeams,
    isLoading,
    error,
  };
};

/**
 * Custom hook to access only enriched players data
 */
export const usePlayersData = () => {
  const players = useSelector(selectEnrichedPlayers);
  const isLoading = useSelector(selectTeamsPlayersLoading);
  const error = useSelector(selectTeamsPlayersError);

  return {
    players,
    isLoading,
    error,
  };
};

/**
 * Custom hook to access only enriched teams data
 */
export const useTeamsData = () => {
  const teams = useSelector(selectEnrichedTeams);
  const isLoading = useSelector(selectTeamsPlayersLoading);
  const error = useSelector(selectTeamsPlayersError);

  return {
    teams,
    isLoading,
    error,
  };
};
