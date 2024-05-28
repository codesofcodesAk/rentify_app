import React, { useState, useEffect } from 'react';
import { fetchProperties } from '../api/api';

const BuyerDashboard = () => {
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
    <div className="container"> {/* Wrap content in container for responsive layout */}
      <div className="row">
        <div className="col-md-12"> {/* Center heading on medium and larger screens */}
          <h2>Welcome to Buyer Dashboard</h2>
          <h3>Property Listings</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12"> {/* Apply responsive columns for listings */}
          <ul className="list-group">
            {properties.map((property) => (
              <li key={property._id} className="list-group-item">
                <div className="row">
                  <div className="col-md-6">
                    <h4>{property.place}</h4>
                    <p>Area: {property.area} sqft</p>
                    <p>Bedrooms: {property.bedrooms}</p>
                    <p>Bathrooms: {property.bathrooms}</p>
                  </div>
                  <div className="col-md-6">
                    <p>Nearby: {property.nearbyFacilities.join(', ')}</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => alert(`Contact seller: ${property.seller.email}`)}
                    >
                      I'm Interested
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 text-center"> {/* Center pagination on medium and larger screens */}
          <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
