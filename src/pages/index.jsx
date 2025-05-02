import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Custom hook to handle client-side only operations
const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
};

export default function Home({ initialDoctors, initialFilters, total }) {
  const router = useRouter();
  const isClient = useClientSide();
  const [doctors, setDoctors] = useState(initialDoctors);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(false);

  // Update filters and trigger data fetch
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`/api/list-doctors?${query}`);
        const data = await res.json();
        setDoctors(data.doctors);
        
        // Update URL without refresh
        router.push(`?${query}`, undefined, { shallow: true });
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if filters changed from initial
    if (JSON.stringify(filters) !== JSON.stringify(initialFilters)) {
      fetchDoctors();
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  return (
    <div>
      <Head>
        <title>General Physician Doctors | Apollo 247 Clone</title>
        <meta name="description" content="Book appointments with top General Physicians" />
        <link rel="canonical" href="https://your-domain.com/doctors" />
      </Head>

      {/* Header - Simplified for example */}
      <header className="header">
        <h1>General Physician Doctors</h1>
      </header>

      {/* Filters */}
      <div className="filters">
        <select 
          value={filters.availability} 
          onChange={(e) => handleFilterChange('availability', e.target.value)}
          disabled={!isClient}
        >
          <option value="">All Availability</option>
          <option value="true">Available Now</option>
        </select>

        <select
          value={filters.consultationType}
          onChange={(e) => handleFilterChange('consultationType', e.target.value)}
          disabled={!isClient}
        >
          <option value="">All Consultation Types</option>
          <option value="online">Online</option>
          <option value="in-person">In-Person</option>
        </select>

        <input
          type="number"
          placeholder="Min Experience (years)"
          value={filters.minExperience || ''}
          onChange={(e) => handleFilterChange('minExperience', e.target.value)}
          disabled={!isClient}
        />
      </div>

      {/* Loading State */}
      {isLoading && <div className="loading">Loading doctors...</div>}

      {/* Doctor List */}
      <div className="doctor-list">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <h3>{doctor.name}</h3>
            <p>Specialization: {doctor.specialization}</p>
            <p>Experience: {doctor.experience} years</p>
            <p>Fee: ₹{doctor.consultationFee}</p>
            <p>Consultation: {doctor.consultationType}</p>
            <p>{doctor.availability ? 'Available Now' : 'Not Available'}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          disabled={filters.page === 1 || isLoading}
        >
          Previous
        </button>
        
        <span>Page {filters.page}</span>
        
        <button
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          disabled={doctors.length < filters.limit || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  
  // Parse and validate filters
  const filters = {
    availability: query.availability || '',
    consultationType: query.consultationType || '',
    minExperience: query.minExperience || '',
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10
  };

  // Fetch doctors from your backend API
  const res = await fetch(
    `http://localhost:5000/api/list-doctors?${new URLSearchParams(filters)}`
  );
  const data = await res.json();

  return {
    props: {
      initialDoctors: data.doctors,
      initialFilters: filters,
      total: data.total
    }
  };
}