# Team Formation Load Testing Suite

This comprehensive load testing suite is designed to test your team formation system with 100 concurrent users, focusing on stability, performance, and the new VotingManager implementation.

## 🎯 Test Objectives

- **Stability**: No server crashes or player logouts
- **Performance**: Response times under 2 seconds
- **Functionality**: All features work correctly under load
- **Voting System**: New setTimeout-based voting system performs well
- **WebSocket Stability**: Real-time connections remain stable

## 🚀 Quick Start

### Prerequisites
- Node.js server running on `localhost:5000`
- MongoDB running
- Artillery.js (installed automatically)

### Setup
```bash
cd load-tests
chmod +x run-tests.sh
npm run setup
```

### Run Tests
```bash
# Basic connectivity test (recommended first)
./run-tests.sh basic

# Full load test with 100 users
./run-tests.sh load

# Voting system stress test
./run-tests.sh voting

# Run all tests
./run-tests.sh all
```

## 📊 Test Scenarios

### 1. Basic Test (`basic-test.yml`)
- **Purpose**: Validate basic connectivity and endpoints
- **Load**: 2 users/second for 60 seconds
- **Focus**: Health checks, session creation
- **Duration**: ~1 minute

### 2. Load Test (`load-test.yml`)
- **Purpose**: Full user journey with 100 concurrent users
- **Load**: 100 users over 30 seconds, sustained for 2 minutes
- **Focus**: Complete game flow simulation
- **Duration**: ~3 minutes

**Test Flow:**
1. **Admin Setup** (1 user):
   - Login as admin
   - Create session
   - Start team formation (10 teams)
   - Start leader voting (30s duration)
   - Finish session

2. **Player Journey** (99 users):
   - Register with unique names
   - Connect WebSocket
   - Get assigned to teams
   - Vote for team leaders
   - Monitor voting progress
   - Receive results

### 3. Voting Test (`voting-test.yml`)
- **Purpose**: Stress test the new VotingManager system
- **Load**: 100 users rapidly joining and voting
- **Focus**: setTimeout accuracy, concurrent voting, leader selection
- **Duration**: ~1 minute

**Stress Points:**
- Rapid user registration
- Concurrent WebSocket connections  
- Multiple vote changes per user
- Continuous voting status checks
- Timer precision testing

## 📈 Monitoring & Metrics

### Real-time Monitoring
The test suite includes a real-time monitor (`scripts/monitor.js`) that tracks:

- **Health Status**: Server availability
- **Response Times**: API endpoint performance
- **Error Rates**: Failed requests percentage
- **Memory Usage**: Server memory consumption
- **Request Volume**: Total requests processed

### Key Performance Indicators (KPIs)

✅ **Success Criteria:**
- Error rate < 5%
- Average response time < 2000ms
- Zero server crashes
- All 100 users complete the flow
- Voting timer accuracy within 1 second
- WebSocket connections remain stable

⚠️ **Warning Signs:**
- Error rate 5-10%
- Response times 2-5 seconds
- Memory usage growing rapidly

❌ **Failure Criteria:**
- Error rate > 10%
- Response times > 5 seconds
- Server crashes or restarts
- WebSocket disconnections > 5%

## 📋 Test Reports

After running tests, HTML reports are generated:

- `load-test-report.html`: Complete load test results
- `voting-test-report.html`: Voting system performance
- `basic-test-report.html`: Basic connectivity results

### Report Metrics
- Request/response statistics
- Error breakdown by endpoint
- Response time percentiles (p50, p95, p99)
- Throughput (requests/second)
- WebSocket connection stats

## 🛠️ Troubleshooting

### Common Issues

**Server Not Responding:**
```bash
# Check if server is running
curl http://localhost:5000/api/v1/health

# Check server logs for errors
```

**High Error Rates:**
- Check database connection
- Verify MongoDB is running
- Review server logs for bottlenecks
- Check memory usage

**WebSocket Issues:**
- Verify Socket.IO is properly initialized
- Check CORS settings
- Monitor connection logs

**Test Failures:**
```bash
# Clean up test data
npm run clean

# Reset and retry
./run-tests.sh basic
```

### Database Cleanup

The test suite automatically cleans up test data, but you can manually clean:

```bash
# Clean test data
node scripts/cleanup.js

# Or use npm script
npm run clean
```

## 🎮 Test Customization

### Modify User Count
Edit `load-test.yml`:
```yaml
config:
  phases:
    - duration: 30
      arrivalRate: 5  # Change this for different load
```

### Adjust Voting Duration
Edit the voting duration in test scenarios:
```yaml
json:
  votingDuration: 30  # Change voting time (seconds)
```

### Add Custom Scenarios
Create new `.yml` files following the Artillery.js format.

## 📞 Support

If tests reveal issues:

1. **Check server logs** for error details
2. **Review HTML reports** for specific failure points
3. **Run basic test first** to isolate issues
4. **Monitor memory usage** during tests
5. **Verify VotingManager** timer accuracy

## 🔍 What Each Test Validates

### Load Test Validates:
- ✅ 100 concurrent user registrations
- ✅ Team formation with proper distribution
- ✅ VotingManager setTimeout accuracy
- ✅ WebSocket message delivery
- ✅ Leader selection algorithm
- ✅ Session state transitions
- ✅ Database performance under load

### Voting Test Validates:
- ✅ Rapid vote changes
- ✅ Concurrent voting requests
- ✅ Timer precision (30-second voting window)
- ✅ Real-time countdown updates
- ✅ Leader selection with ties
- ✅ Processing state management

The test suite comprehensively validates that your new VotingManager implementation can handle 100+ concurrent users without crashes, logouts, or performance degradation!
