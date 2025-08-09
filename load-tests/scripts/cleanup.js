const { MongoClient } = require('mongodb');

class TestCleanup {
  constructor() {
    this.mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/team-formation';
  }

  async cleanupDatabase() {
    let client;
    try {
      console.log('🧹 Cleaning up test data...');
      
      client = new MongoClient(this.mongoUrl);
      await client.connect();
      
      const db = client.db();
      
      // Remove test sessions
      const sessionsResult = await db.collection('sessions').deleteMany({
        sessionName: { $regex: /test|load|stress/i }
      });
      
      // Remove test players
      const playersResult = await db.collection('players').deleteMany({
        firstName: { $regex: /player|test|stress/i }
      });
      
      // Remove test teams
      const teamsResult = await db.collection('teams').deleteMany({
        // Teams associated with test sessions will be removed by cascade
      });
      
      // Remove test admins
      const adminsResult = await db.collection('admins').deleteMany({
        name: { $regex: /test|load|stress/i }
      });
      
      // Remove voting timers
      const timersResult = await db.collection('votingtimers').deleteMany({});
      
      console.log(`✅ Cleanup completed:
      📋 Sessions: ${sessionsResult.deletedCount}
      👥 Players: ${playersResult.deletedCount}
      🎯 Teams: ${teamsResult.deletedCount}
      👑 Admins: ${adminsResult.deletedCount}
      ⏰ Voting Timers: ${timersResult.deletedCount}`);
      
    } catch (error) {
      console.error('❌ Cleanup error:', error.message);
    } finally {
      if (client) {
        await client.close();
      }
    }
  }

  async resetTestEnvironment() {
    console.log('🔄 Resetting test environment...');
    await this.cleanupDatabase();
    
    // Wait a moment for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Test environment ready!');
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  const cleanup = new TestCleanup();
  cleanup.resetTestEnvironment()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = TestCleanup;
