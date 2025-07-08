export const API_TAGS = {
  SESSION: 'Session',
  PLAYER: 'Player',
  TEAM_PLAYER_VOTES: 'TeamPlayerVotes',
  ALL_PLAYERS:"AllPlayers",
  ALL_TEAMS: 'AllTeams',
} as const;

export const tagTypes = Object.values(API_TAGS);
export const createEntityTag = (entityType: string, id?: string | number) => ({
  type: entityType,
  id: id || 'LIST'
});

export const createListTag = (entityType: string) => ({
  type: entityType,
  id: 'LIST'
});
