const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testLogin() {
  try {
    console.log('🔍 Probando login con admin/admin123...\n');
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123',
    });

    console.log('✅ Login exitoso!');
    console.log('Token:', response.data.access_token.substring(0, 50) + '...');
    console.log('Usuario:', response.data.user);
  } catch (error) {
    console.error('❌ Error en login:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Mensaje:', error.response.data?.message || error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
      console.error('¿Está corriendo el backend en', API_URL, '?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();

