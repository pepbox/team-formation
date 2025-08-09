import { VotingTimer } from "../../modules/voting/models/votingTimer";

/**
 * Cleanup service to remove old voting timer documents
 * Run this periodically to keep the database clean
 */
export class VotingCleanupService {
  
  /**
   * Remove all expired voting timer documents
   */
  static async cleanupExpiredTimers(): Promise<void> {
    try {
      const result = await VotingTimer.deleteMany({
        votingEndTime: { $lt: new Date() }
      });
      
      if (result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} expired voting timers`);
      }
    } catch (error) {
      console.error("Error cleaning up expired voting timers:", error);
    }
  }

  /**
   * Remove all voting timers for a specific session
   */
  static async cleanupSessionTimers(sessionId: string): Promise<void> {
    try {
      const result = await VotingTimer.deleteMany({ sessionId });
      console.log(`Cleaned up ${result.deletedCount} voting timers for session ${sessionId}`);
    } catch (error) {
      console.error(`Error cleaning up voting timers for session ${sessionId}:`, error);
    }
  }
}
