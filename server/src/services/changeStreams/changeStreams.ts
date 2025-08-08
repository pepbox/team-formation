import VotingChangeStream from "./votingChangeStream";

class ChangeStreamManager {
    private votingChangeStream: VotingChangeStream;

    constructor() {
        this.votingChangeStream = new VotingChangeStream();
    }

    async initializeAll() {
        try {
            await this.votingChangeStream.initialize();
        } catch (error) {
            console.error("Error initializing change streams:", error);
        }
    }

    async closeAll() {
        try {
            await this.votingChangeStream.close();
        } catch (error) {
            console.error("Error closing change streams:", error);
        }
    }
}

export default ChangeStreamManager;