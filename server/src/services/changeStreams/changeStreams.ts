import VotingChangeStream from "./votingChangeStream";

class ChangeStreamManager {
    private votingChangeStream: VotingChangeStream;

    constructor() {
        this.votingChangeStream = new VotingChangeStream();
    }

    async initializeAll() {
        try {
            console.log("Initializing all change streams...");
            await this.votingChangeStream.initialize();
            console.log("All change streams initialized successfully");
        } catch (error) {
            console.error("Error initializing change streams:", error);
        }
    }

    async closeAll() {
        try {
            console.log("Closing all change streams...");
            await this.votingChangeStream.close();
            console.log("All change streams closed successfully");
        } catch (error) {
            console.error("Error closing change streams:", error);
        }
    }
}

export default ChangeStreamManager;