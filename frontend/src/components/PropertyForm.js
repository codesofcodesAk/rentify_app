import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../api/api';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    place: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    nearbyFacilities: '',
  });
  const navigate = useNavigate();
  const { id } = useParams(); // For updating property

  useEffect(() => {
    if (id) {
      // Fetch the existing property details if updating
      axios.get(API_URL+`/properties/${id}`)
        .then(response => {
          const property = response.data;
          setFormData({
            place: property.place,
            area: property.area,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            nearbyFacilities: property.nearbyFacilities.join(', '),
          });
        })
        .catch(error => console.error('Error fetching property:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (id) {
      // Update property
      axios.put(API_URL+`/properties/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => navigate('/seller-dashboard'))
        .catch(error => console.error('Error updating property:', error));
    } else {
      // Create new property
      axios.post(API_URL+'/properties', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(() => navigate('/seller-dashboard'))
        .catch(error => console.error('Error creating property:', error));
    }
  };

  return (
    <div>
      <h2>{id ? 'Update Property' : 'Post a New Property'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Place:</label>
          <input type="text" name="place" value={formData.place} onChange={handleChange} required />
        </div>
        <div>
          <label>Area (sq ft):</label>
          <input type="number" name="area" value={formData.area} onChange={handleChange} required />
        </div>
        <div>
          <label>Bedrooms:</label>
          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
        </div>
        <div>
          <label>Bathrooms:</label>
          <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
        </div>
        <div>
          <label>Nearby Facilities (comma separated):</label>
          <input type="text" name="nearbyFacilities" value={formData.nearbyFacilities} onChange={handleChange} required />
        </div>
        <button type="submit">{id ? 'Update Property' : 'Post Property'}</button>
      </form>
    </div>
  );
};

export default PropertyForm;
