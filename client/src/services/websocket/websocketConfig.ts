import { API_TAGS } from "../../app/apiTags";
import store from "../../app/store";
// import { authApi } from "../../features/user/auth/authApi";
// import { updateSession } from "../../features/session/sessionSlice";
import { playerApi } from "../../features/user/player/playerApi";
import { ServerToAllEvents } from "./enums/SharedEvents";
import { ServerToUserEvents } from "./enums/UserEvents";
import { websocketService } from "./websocketService";
import { ServerToAdminEvents } from "./enums/AdminEvents";
import { sessionApi } from "../../features/session/sessionApi";
import { throttle } from "../../utility/throttle";

export const setupGlobalListeners = () => {
  websocketService.addGlobalListener(
    ServerToAllEvents.SESSION_UPDATE,
    () => {
      store.dispatch(sessionApi.util.invalidateTags([API_TAGS.SESSION]));
      // store.dispatch(authApi.endpoints.fetchPlayer.initiate(undefined));
      // store.dispatch(updateSession(data));
    },
    "redux"
  );

  websocketService.addGlobalListener(
    ServerToUserEvents.TEAMPLAYER_VOTE_UPDATE,
    () => {
      store.dispatch(
        playerApi.util.invalidateTags([API_TAGS.TEAM_PLAYER_VOTES])
      );
      store.dispatch(
        playerApi.endpoints.fetchMyTeamPlayerVotes.initiate(undefined)
      );
    },
    "redux"
  );

  

  websocketService.addGlobalListener(
    ServerToAdminEvents.PLAYERS_UPDATE,
    throttle(() => {
      store.dispatch(sessionApi.util.invalidateTags([API_TAGS.ALL_PLAYERS]));
    }, 3000),
    "redux"
  );
  websocketService.addGlobalListener(
    ServerToAdminEvents.TEAMS_UPDATE,
    throttle(() => {
      store.dispatch(sessionApi.util.invalidateTags([API_TAGS.ALL_TEAMS]));
    }, 3000),
    "redux"
  );

  //   websocketService.addGlobalListener(
  //     "user_status_changed",
  //     (data) => {
  //       store.dispatch(updateUserStatus(data));
  //     },
  //     "redux"
  //   );

  //   websocketService.addGlobalListener(
  //     "system_message",
  //     (data) => {
  //       store.dispatch(setSystemMessage(data));
  //     },
  //     "redux"
  //   );

  //   websocketService.addGlobalListener(
  //     "refresh_user_data",
  //     async (data) => {
  //       try {
  //         await apiService.refreshUserData(data.userId);
  //       } catch (error) {
  //         console.error("Failed to refresh user data:", error);
  //       }
  //     },
  //     "api"
  //   );

  //   websocketService.addGlobalListener(
  //     "sync_data",
  //     async (data) => {
  //       try {
  //         await apiService.syncData(data);
  //       } catch (error) {
  //         console.error("Failed to sync data:", error);
  //       }
  //     },
  //     "api"
  //   );
};

export const websocketEmitters = {
  // User actions
  //   joinRoom: (roomId: string) => {
  //     websocketService.emit('join_room', { roomId });
  //   },
  //   leaveRoom: (roomId: string) => {
  //     websocketService.emit('leave_room', { roomId });
  //   },
  //   sendMessage: (roomId: string, message: string) => {
  //     websocketService.emit('send_message', { roomId, message });
  //   },
  //   updateUserStatus: (status: 'online' | 'away' | 'busy') => {
  //     websocketService.emit('update_status', { status });
  //   },
  //   // Typing indicators
  //   startTyping: (roomId: string) => {
  //     websocketService.emit('typing_start', { roomId });
  //   },
  //   stopTyping: (roomId: string) => {
  //     websocketService.emit('typing_stop', { roomId });
  //   },
  //   // Real-time data sync
  //   requestDataSync: (dataType: string) => {
  //     websocketService.emit('request_sync', { dataType });
  //   },
  //   // Custom events
  //   customEvent: (eventType: string, payload: any) => {
  //     websocketService.emit(eventType, payload);
  //   }
};

export const initializeWebSocket = async (
  serverUrl: string,
  authToken?: string
) => {
  try {
    const options: any = {};
    if (authToken) {
      options.auth = { token: authToken };
    }

    await websocketService.connect(serverUrl, options);
    setupGlobalListeners();
    console.log("Socket.IO initialized with global listeners");
  } catch (error) {
    console.error("Failed to initialize Socket.IO:", error);
    throw error;
  }
};
