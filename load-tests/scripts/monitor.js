const axios = require('axios');

class LoadTestMonitor {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.metrics = {
      startTime: Date.now(),
      requests: 0,
      errors: 0,
      responseTimes: [],
      memoryUsage: [],
      activeSessions: 0
    };
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/health`, {
        timeout: 5000
      });
      return { status: 'healthy', statusCode: response.status };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error.message,
        statusCode: error.response?.status || 'timeout'
      };
    }
  }

  async monitorMemory() {
    // In a real scenario, you'd need an endpoint that exposes memory stats
    // For now, we'll simulate this
    const memUsage = process.memoryUsage();
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external
    });
  }

  async testBasicEndpoints() {
    const endpoints = [
      { method: 'GET', path: '/api/v1/health' },
      // Add more critical endpoints
    ];

    const results = [];
    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await axios({
          method: endpoint.method,
          url: `${this.baseUrl}${endpoint.path}`,
          timeout: 10000
        });
        const responseTime = Date.now() - startTime;
        
        results.push({
          endpoint: endpoint.path,
          status: 'success',
          statusCode: response.status,
          responseTime
        });
        
        this.metrics.responseTimes.push(responseTime);
        this.metrics.requests++;
      } catch (error) {
        results.push({
          endpoint: endpoint.path,
          status: 'error',
          error: error.message,
          statusCode: error.response?.status || 'timeout'
        });
        this.metrics.errors++;
      }
    }
    
    return results;
  }

  async startMonitoring(intervalMs = 5000) {
    console.log('🔍 Starting load test monitoring...');
    
    const monitoringInterval = setInterval(async () => {
      try {
        const health = await this.healthCheck();
        const endpoints = await this.testBasicEndpoints();
        await this.monitorMemory();
        
        const avgResponseTime = this.metrics.responseTimes.length > 0
          ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
          : 0;
        
        const errorRate = this.metrics.requests > 0
          ? (this.metrics.errors / this.metrics.requests) * 100
          : 0;

        console.log(`
📊 Load Test Metrics (${new Date().toISOString()})
🏥 Health: ${health.status}
📈 Requests: ${this.metrics.requests}
❌ Errors: ${this.metrics.errors} (${errorRate.toFixed(2)}%)
⏱️  Avg Response Time: ${avgResponseTime.toFixed(2)}ms
💾 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
        `);
        
        // Alert if error rate is too high
        if (errorRate > 5) {
          console.error(`🚨 HIGH ERROR RATE: ${errorRate.toFixed(2)}%`);
        }
        
        // Alert if response time is too slow
        if (avgResponseTime > 2000) {
          console.error(`🐌 SLOW RESPONSE TIME: ${avgResponseTime.toFixed(2)}ms`);
        }
        
      } catch (error) {
        console.error('Monitoring error:', error.message);
      }
    }, intervalMs);

    // Stop monitoring after 10 minutes
    setTimeout(() => {
      clearInterval(monitoringInterval);
      this.generateReport();
    }, 10 * 60 * 1000);
  }

  generateReport() {
    const duration = Date.now() - this.metrics.startTime;
    const avgResponseTime = this.metrics.responseTimes.length > 0
      ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
      : 0;
    
    console.log(`
🎯 LOAD TEST FINAL REPORT
========================
⏰ Duration: ${(duration / 1000).toFixed(2)}s
📊 Total Requests: ${this.metrics.requests}
❌ Total Errors: ${this.metrics.errors}
📈 Error Rate: ${((this.metrics.errors / this.metrics.requests) * 100).toFixed(2)}%
⏱️  Average Response Time: ${avgResponseTime.toFixed(2)}ms
💾 Peak Memory Usage: ${Math.max(...this.metrics.memoryUsage.map(m => m.heapUsed)) / 1024 / 1024}MB

${this.metrics.errors === 0 ? '✅ SUCCESS: No errors detected!' : '❌ ISSUES: Errors detected during testing'}
${avgResponseTime < 2000 ? '✅ PERFORMANCE: Response times within acceptable range' : '⚠️  PERFORMANCE: Slow response times detected'}
    `);
  }
}

// Run monitoring if this script is executed directly
if (require.main === module) {
  const monitor = new LoadTestMonitor();
  monitor.startMonitoring(2000); // Monitor every 2 seconds during load test
}

module.exports = LoadTestMonitor;
