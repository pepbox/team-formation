#!/bin/bash

# Team Formation Load Testing Suite
# Usage: ./run-tests.sh [test-type]
# Test types: basic, load, voting, stress, all

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if server is running
check_server() {
    print_status "Checking if server is running on localhost:5000..."
    if curl -s -f http://localhost:5000/api/v1/health > /dev/null 2>&1; then
        print_success "Server is running!"
    else
        print_warning "Server health check failed, but continuing with tests..."
    fi
}

# Install dependencies
setup_tests() {
    print_status "Setting up load tests..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Make sure you're in the load-tests directory."
        exit 1
    fi
    
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    print_success "Setup completed!"
}

# Clean up before tests
cleanup_before() {
    print_status "Cleaning up test data before starting..."
    node scripts/cleanup.js
}

# Run basic connectivity test
run_basic_test() {
    print_status "Running basic connectivity test..."
    npx artillery run basic-test.yml --output basic-test-report.json
    print_success "Basic test completed!"
}

# Run main load test
run_load_test() {
    print_status "Running full load test with 100 users..."
    print_warning "This will take approximately 3 minutes..."
    
    # Start monitoring in background
    node scripts/monitor.js &
    MONITOR_PID=$!
    
    # Run the load test
    npx artillery run load-test.yml --output load-test-report.json
    
    # Stop monitoring
    kill $MONITOR_PID 2>/dev/null || true
    
    print_success "Load test completed!"
}

# Run voting stress test
run_voting_test() {
    print_status "Running voting system stress test..."
    npx artillery run voting-test.yml --output voting-test-report.json
    print_success "Voting test completed!"
}

# Run all tests
run_all_tests() {
    print_status "Running complete test suite..."
    
    cleanup_before
    run_basic_test
    sleep 5
    
    cleanup_before  
    run_voting_test
    sleep 5
    
    cleanup_before
    run_load_test
    
    print_success "All tests completed!"
}

# Generate HTML report
generate_report() {
    print_status "Generating HTML reports..."
    
    if [ -f "load-test-report.json" ]; then
        npx artillery report load-test-report.json --output load-test-report.html
        print_success "Load test report: load-test-report.html"
    fi
    
    if [ -f "voting-test-report.json" ]; then
        npx artillery report voting-test-report.json --output voting-test-report.html
        print_success "Voting test report: voting-test-report.html"
    fi
    
    if [ -f "basic-test-report.json" ]; then
        npx artillery report basic-test-report.json --output basic-test-report.html
        print_success "Basic test report: basic-test-report.html"
    fi
}

# Main script logic
main() {
    local test_type=${1:-"basic"}
    
    print_status "Team Formation Load Testing Suite"
    print_status "================================="
    
    check_server
    setup_tests
    
    case $test_type in
        "basic")
            cleanup_before
            run_basic_test
            ;;
        "load")
            cleanup_before
            run_load_test
            ;;
        "voting")
            cleanup_before
            run_voting_test
            ;;
        "all")
            run_all_tests
            ;;
        *)
            print_error "Unknown test type: $test_type"
            print_status "Available test types: basic, load, voting, all"
            exit 1
            ;;
    esac
    
    generate_report
    
    print_success "Testing completed! Check the HTML reports for detailed results."
}

# Run main function with all arguments
main "$@"
