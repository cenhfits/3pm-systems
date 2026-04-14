import requests
import sys
from datetime import datetime

class SimpleAPITester:
    def __init__(self, base_url="https://muscle-foundation.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.content:
                    try:
                        print(f"   Response: {response.json()}")
                    except:
                        print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "api/", 200)

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        return self.run_test("Create Status Check", "POST", "api/status", 200, data=test_data)

    def test_get_status_checks(self):
        """Test getting status checks"""
        return self.run_test("Get Status Checks", "GET", "api/status", 200)

def main():
    print("🚀 Starting Backend API Tests for 3 Pillar Muscle System")
    print("=" * 60)
    
    # Setup
    tester = SimpleAPITester()

    # Run tests
    print("\n📋 Testing Basic API Endpoints...")
    
    # Test root endpoint
    success1, _ = tester.test_root_endpoint()
    
    # Test status check creation
    success2, _ = tester.test_create_status_check()
    
    # Test status check retrieval
    success3, _ = tester.test_get_status_checks()

    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Backend Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("✅ All backend tests passed! API is working correctly.")
        return 0
    else:
        print("❌ Some backend tests failed. Check the API endpoints.")
        return 1

if __name__ == "__main__":
    sys.exit(main())