import React, { useEffect, useState } from 'react';
import { fetchProperties } from '../api/api';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchProperties(currentPage);
      setProperties(data.properties);
      setTotalPages(data.totalPages);
    };

    fetchData();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2>Property Listings</h2>
      <ul>
        {properties.map((property) => (
          <li key={property._id}>
            <h3>{property.place}</h3>
            <p>Area: {property.area} sqft</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
            <p>Nearby: {property.nearbyFacilities.join(', ')}</p>
            <button onClick={() => alert(`Contact seller: ${property.seller.email}`)}>I'm Interested</button>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handlePrevPage}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default PropertyList;
