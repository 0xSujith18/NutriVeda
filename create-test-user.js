// Simple script to create a test user
import axios from 'axios';

const createTestUser = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('Token:', response.data.token);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
      console.log('Test user already exists!');
      console.log('Email: test@example.com');
      console.log('Password: password123');
    } else {
      console.error('Error creating test user:', error.response?.data || error.message);
    }
  }
};

createTestUser();