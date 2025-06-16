import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaSearch, FaDollarSign, FaMapMarkerAlt, FaBriefcase, FaSpinner,
  FaInfoCircle, FaCalendarAlt, FaExternalLinkAlt, FaTimesCircle, FaCopy,
  FaBuilding, FaTags, FaLightbulb, FaBriefcaseMedical, FaLink, FaHistory, FaUserCircle
} from 'react-icons/fa';

function Job() {
  const [salaryInfo, setSalaryInfo] = useState(null);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const resultsRef = useRef(null);

  const [linkedInPositions, setLinkedInPositions] = useState([]);
  const [linkedInSkills, setLinkedInSkills] = useState([]);

  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem('recentSearches');
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  const fetchSalaryData = async () => {
    if (!jobTitle.trim() || !location.trim()) {
      setError('Please enter both a job title and a location to search.');
      setSalaryInfo(null);
      toast.error('Both fields are required!');
      return;
    }

    setLoading(true);
    setError(null);
    setSalaryInfo(null);
    setLinkedInPositions([]);
    setLinkedInSkills([]);

    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/estimated-salary',
      params: {
        job_title: jobTitle,
        location,
        location_type: 'ANY',
        years_of_experience: 'ALL',
      },
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data?.data?.length > 0) {
        setSalaryInfo(response.data.data[0]);
        toast.success('Salary data fetched successfully!');
        const newSearch = { jobTitle, location };
        setRecentSearches(prevSearches => {
          const filtered = prevSearches.filter(s => s.jobTitle !== jobTitle || s.location !== location);
          return [newSearch, ...filtered].slice(0, 5);
        });
        fetchLinkedInProfileData('tedgaubert');
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError('No salary data found for your criteria. Try a different job title or location.');
        toast.error('No data found for this search.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch salary data. Please check your internet connection or try again later.');
      toast.error('Failed to fetch salary data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinkedInProfileData = async (username) => {
    const options = {
      method: 'GET',
      url: 'https://linkedin-api8.p.rapidapi.com/profiles/position-skills',
      params: {
        username: username
      },
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      if (response.data?.data?.items?.length > 0) {
        const positions = response.data.data.items.map(item => ({
          companyName: item.companyName,
          companyLogo: item.companyLogo?.[0]?.url,
          title: item.title,
          skills: item.skills,
          companyURL: item.companyURL
        }));
        setLinkedInPositions(positions);

        const allSkills = new Set();
        positions.forEach(pos => pos.skills?.forEach(skill => allSkills.add(skill)));
        setLinkedInSkills(Array.from(allSkills));

        toast.success(`LinkedIn profile data loaded for ${username}!`);
      } else {
        console.warn(`No LinkedIn profile data found for ${username}.`);
        setLinkedInPositions([]);
        setLinkedInSkills([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load LinkedIn profile data.');
      setLinkedInPositions([]);
      setLinkedInSkills([]);
    }
  };

  const clearInput = (field) => {
    if (field === 'jobTitle') setJobTitle('');
    if (field === 'location') setLocation('');
  };

  const copySalaryInfo = () => {
    if (salaryInfo) {
      const textToCopy = `Job: ${salaryInfo.job_title}\nLocation: ${salaryInfo.location}\nSalary Range: $${salaryInfo.min_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })} - $${salaryInfo.max_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })} / ${salaryInfo.salary_period}\nMedian Salary: $${salaryInfo.median_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => toast.success('Salary info copied to clipboard!'))
        .catch(err => {
          console.error(err);
          toast.error('Failed to copy salary info.');
        });
    }
  };

  const removeSearch = (searchToRemove) => {
    setRecentSearches(prevSearches => {
      const updatedSearches = prevSearches.filter(
        (search) => search.jobTitle !== searchToRemove.jobTitle || search.location !== searchToRemove.location
      );
      toast.success('Search removed!');
      return updatedSearches;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="w-full max-w-4xl rounded-xl shadow-2xl p-8 space-y-8 border border-gray-200 transform transition-all duration-300 hover:scale-[1.005] bg-white/5 backdrop-filter backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center flex items-center justify-center gap-3">
          <FaDollarSign className="text-emerald-500 text-3xl animate-bounce-slow" />
          Find Your Dream Job
        </h1>
        <p className="text-center text-gray-700 text-md max-w-md mx-auto">
          Get estimated salary ranges and explore real-world career paths from professional profiles.
        </p>

        <div className="max-h-[calc(85vh-200px)] overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="relative group">
              <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title (e.g., Data Scientist)"
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/50 backdrop-filter backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && fetchSalaryData()}
                aria-label="Job Title"
              />
              {jobTitle && (
                <button
                  onClick={() => clearInput('jobTitle')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Clear job title"
                >
                  <FaTimesCircle className="text-sm" />
                </button>
              )}
            </div>
            <div className="relative group">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g., London)"
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg w-full text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/50 backdrop-filter backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && fetchSalaryData()}
                aria-label="Location"
              />
              {location && (
                <button
                  onClick={() => clearInput('location')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Clear location"
                >
                  <FaTimesCircle className="text-sm" />
                </button>
              )}
            </div>
            <button
              onClick={fetchSalaryData}
              className={`w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 text-sm
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
              aria-label="Search"
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-2 text-md" />
              ) : (
                <FaSearch className="mr-2 text-md" />
              )}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="pt-2 border-t border-gray-100 mt-4 animate-fade-in">
              <p className="text-gray-700 text-xs font-semibold mb-2 flex items-center gap-1">
                <FaHistory className="text-gray-500 text-sm" /> Recent Searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => {
                        setJobTitle(search.jobTitle);
                        setLocation(search.location);
                        toast(`Loaded: ${search.jobTitle} in ${search.location}`);
                        fetchSalaryData();
                      }}
                      className="bg-white/30 text-gray-800 text-xs px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 pr-7 backdrop-filter backdrop-blur-sm"
                      title={`Search for ${search.jobTitle} in ${search.location}`}
                    >
                      {search.jobTitle} in {search.location}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(search);
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors z-10 p-1 rounded-full"
                      aria-label={`Remove search for ${search.jobTitle} in ${search.location}`}
                      title="Remove search"
                    >
                      <FaTimesCircle className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-6">
              <div className="bg-white/10 rounded-xl h-48 flex items-center justify-center animate-pulse border border-gray-200 backdrop-filter backdrop-blur-md">
                <FaSpinner className="text-blue-500 text-3xl animate-spin" />
              </div>
              <p className="flex items-center justify-center text-blue-600 text-sm font-medium mt-4">
                <FaSpinner className="animate-spin mr-2" /> Loading estimated salary data...
              </p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm text-center mt-4 flex flex-col items-center justify-center gap-2 animate-fade-in transition-all duration-300">
              <FaInfoCircle className="text-md" /> {error}
              <button
                onClick={fetchSalaryData}
                className="mt-2 text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
              >
                <FaSearch /> Try Search Again
              </button>
            </div>
          )}

          {!loading && !error && linkedInPositions.length > 0 && (
            <div className="space-y-6 mt-8">
              <div className="rounded-xl border border-gray-200 shadow-sm p-6 animate-fade-in bg-white/5 backdrop-filter backdrop-blur-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 border-gray-100">
                  <FaUserCircle className="text-indigo-500" /> Companies from Sample Profile: "Ted Gaubert"
                </h3>
                <div className="max-h-60 overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {linkedInPositions.map((pos, index) => (
                      <a
                        key={index}
                        href={pos.companyURL || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-3 border border-gray-100 rounded-lg hover:shadow-md transition-shadow hover:bg-white/10 group backdrop-filter backdrop-blur-sm"
                        title={`View ${pos.companyName}'s LinkedIn page or related jobs`}
                      >
                        <img
                          src={pos.companyLogo || 'https://via.placeholder.com/40/F3F4F6/9CA3AF?text=Co'}
                          alt={`${pos.companyName} logo`}
                          className="w-10 h-10 object-contain mb-2 flex-shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <p className="text-sm font-medium text-gray-700 text-center">{pos.companyName}</p>
                        <p className="text-xs text-gray-500 text-center mt-1 truncate w-full">{pos.title}</p>
                        <FaExternalLinkAlt className="text-indigo-500 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  <FaInfoCircle className="inline-block mr-1" />
                  *This section displays companies and roles from a **sample LinkedIn profile (Ted Gaubert)** to demonstrate API integration.
                </p>
              </div>

              {linkedInSkills.length > 0 && (
                <div className="rounded-xl border border-gray-200 shadow-sm p-6 animate-fade-in bg-white/5 backdrop-filter backdrop-blur-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 border-gray-100">
                    <FaTags className="text-purple-500" /> Key Skills from Sample Profile
                  </h3>
                  <div className="max-h-40 overflow-y-auto pr-2">
                    <div className="flex flex-wrap gap-2">
                      {linkedInSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-white/30 text-purple-800 text-xs px-3 py-1 rounded-full backdrop-filter backdrop-blur-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4">
                    <FaInfoCircle className="inline-block mr-1" />
                    *These are key skills extracted from the sample LinkedIn profile's work experience.
                  </p>
                </div>
              )}
            </div>
          )}

          {salaryInfo && (
            <div ref={resultsRef} className="rounded-xl border border-gray-200 shadow-sm p-6 space-y-5 mt-6 animate-fade-in bg-white/5 backdrop-filter backdrop-blur-md">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaBriefcaseMedical className="text-gray-500 text-lg" /> {salaryInfo.job_title}
                  <span className="text-gray-600 font-normal text-lg flex items-center gap-1">
                    <FaMapMarkerAlt className="text-sm" /> {salaryInfo.location}
                  </span>
                </h2>
                <button
                  onClick={copySalaryInfo}
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm"
                  aria-label="Copy salary info"
                  title="Copy salary information"
                >
                  <FaCopy /> Copy
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-200 transform transition-transform hover:scale-[1.01] bg-white/10 backdrop-filter backdrop-blur-sm">
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Salary Range</p>
                  <p className="text-2xl font-semibold text-emerald-600">
                    ${salaryInfo.min_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })} - ${salaryInfo.max_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-gray-600 text-xs capitalize mt-1">per {salaryInfo.salary_period?.toLowerCase() || 'period'}</p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 transform transition-transform hover:scale-[1.01] bg-white/10 backdrop-filter backdrop-blur-sm">
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Median Salary</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    ${salaryInfo.median_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-gray-600 text-xs capitalize mt-1">per {salaryInfo.salary_period?.toLowerCase() || 'period'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-200 bg-white/10 backdrop-filter backdrop-blur-sm">
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Base Salary</p>
                  <p className="text-lg font-medium text-gray-800">
                    ${salaryInfo.min_base_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })} - ${salaryInfo.max_base_salary?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-gray-200 bg-white/10 backdrop-filter backdrop-blur-sm">
                  <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Additional Pay</p>
                  <p className="text-lg font-medium text-gray-800">
                    ${salaryInfo.min_additional_pay?.toLocaleString('en-US', { maximumFractionDigits: 0 })} - ${salaryInfo.max_additional_pay?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 mt-5 text-sm text-gray-700 flex justify-between items-center flex-wrap gap-y-2">
                <p className="flex items-center gap-2">
                  <FaBuilding className="text-gray-500 text-sm" />
                  Publisher:{' '}
                  <a
                    href={salaryInfo.publisher_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    {salaryInfo.publisher_name || 'N/A'}
                    <FaExternalLinkAlt className="text-xs ml-0.5" />
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <FaInfoCircle className="text-gray-500 text-sm" />
                  Confidence: <span className="font-medium">{salaryInfo.confidence || 'N/A'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500 text-sm" />
                  Updated:{' '}
                  <span className="font-medium">
                    {salaryInfo.salaries_updated_at ? new Date(salaryInfo.salaries_updated_at).toLocaleDateString() : 'N/A'}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 shadow-sm p-6 animate-fade-in bg-white/5 backdrop-filter backdrop-blur-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2 border-gray-100">
              <FaLightbulb className="text-yellow-500" /> Tips for Salary Negotiation
            </h3>
            <ul className="list-none space-y-3 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <FaInfoCircle className="text-gray-600 mt-1 flex-shrink-0" />
                **Research is Key:** Use tools like this estimator to know your market value.
              </li>
              <li className="flex items-start gap-2">
                <FaInfoCircle className="text-gray-600 mt-1 flex-shrink-0" />
                **Highlight Your Value:** Prepare specific examples of your accomplishments and how they align with the role.
              </li>
              <li className="flex items-start gap-2">
                <FaInfoCircle className="text-gray-600 mt-1 flex-shrink-0" />
                **Consider the Whole Package:** Look beyond base salary to benefits, bonuses, equity, and PTO.
              </li>
              <li className="flex items-start gap-2">
                <FaInfoCircle className="text-gray-600 mt-1 flex-shrink-0" />
                **Be Confident, Yet Flexible:** Clearly state your desired range but be open to negotiation.
              </li>
              <li className="flex items-start gap-2">
                <FaInfoCircle className="text-gray-600 mt-1 flex-shrink-0" />
                **Get it in Writing:** Always ensure the final offer is documented.
              </li>
            </ul>
            <p className="text-xs text-gray-600 mt-4 flex items-center gap-1">
              <FaLink className="inline-block mr-1" />
              <a href="https://www.forbes.com/sites/ashleystahl/2023/11/07/how-to-negotiate-salary-like-a-pro/?sh=4b7e19d67b0d" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Learn more about salary negotiation.
              </a>
            </p>
          </div>

          {!salaryInfo && !error && !loading && (jobTitle.trim() === '' && location.trim() === '') && (
            <div className="bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg text-sm text-center mt-4 flex items-center justify-center gap-2 animate-fade-in">
              <FaInfoCircle className="text-md" />
              Enter a job title and location to find salary estimates and career insights instantly!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Job;