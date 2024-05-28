import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../api/api';

const SellerDashboard = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(API_URL+'/properties', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => setProperties(response.data))
      .catch(error => console.error('Error fetching properties:', error));
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(API_URL+`/properties/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => setProperties(properties.filter(property => property._id !== id)))
      .catch(error => console.error('Error deleting property:', error));
  };

  return (
    <div>
      <h2>Seller Dashboard</h2>
      <Link to="/properties/new">Post a New Property</Link>
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            <h3>{property.place}</h3>
            <p>Area: {property.area} sq ft</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Nearby Facilities: {property.nearbyFacilities.join(', ')}</p>
            <Link to={`/properties/${property._id}/edit`}>Edit</Link>
            <button onClick={() => handleDelete(property._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDashboard;
