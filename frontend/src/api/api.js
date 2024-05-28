import axios from 'axios';

// const API_URL = 'http://localhost:5000';
export const API_URL = 'http://192.168.1.73:5000';

const register = (user) => axios.post(`${API_URL}/register`, user);
const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
const fetchProperties = () => axios.get(`${API_URL}/properties/all`);
const postProperty = (property, token) => axios.post(`${API_URL}/properties`, property, {
  headers: { Authorization: token }
});
const fetchSellerProperties = (token) => axios.get(`${API_URL}/properties`, {
  headers: { Authorization: token }
});
const updateProperty = (id, property, token) => axios.put(`${API_URL}/properties/${id}`, property, {
  headers: { Authorization: token }
});
const deleteProperty = (id, token) => axios.delete(`${API_URL}/properties/${id}`, {
  headers: { Authorization: token }
});

export { register, login, fetchProperties, postProperty, fetchSellerProperties, updateProperty, deleteProperty };
