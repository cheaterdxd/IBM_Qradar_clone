"""
Quick script to create a test admin user
"""
import requests

url = "http://localhost:8000/api/auth/register"
data = {
    "username": "admin",
    "password": "admin123",
    "full_name": "Administrator",
    "email": "admin@qradar.local"
}

try:
    response = requests.post(url, json=data)
    if response.status_code == 201:
        print("✅ User created successfully!")
        print(f"Username: admin")
        print(f"Password: admin123")
    elif response.status_code == 400:
        print("⚠️  User already exists!")
        print(f"Username: admin")
        print(f"Password: admin123")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.json())
except Exception as e:
    print(f"❌ Failed to connect to backend: {e}")
    print("\nMake sure the backend is running on http://localhost:8000")
