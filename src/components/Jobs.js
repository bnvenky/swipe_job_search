import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import { useJob } from '../contexts/JobContext';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [swipedJobs, setSwipedJobs] = useState({});
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [popUpMessage, setPopUpMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { setBookmarkedJobs, bookmarkedJobs } = useJob();

  // Fetch job list from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://testapi.getlokalapp.com/common/jobs?page=3');
        if (response.data && Array.isArray(response.data.results)) {
          const initialJobs = response.data.results;
          const savedSwipedJobs = JSON.parse(localStorage.getItem('swipedJobs')) || {};
          const filteredJobs = initialJobs.filter(job => !savedSwipedJobs[job.id]);
          setJobs(filteredJobs);
          setSwipedJobs(savedSwipedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Load bookmarked jobs from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    setBookmarkedJobs(savedBookmarks);
  }, [setBookmarkedJobs]);

  // Handle swiping left or right
  const handleSwipe = (direction, job) => {
    const updatedSwipedJobs = {
      ...swipedJobs,
      [job.id]: direction === 'right' ? 'bookmarked' : 'not_interested',
    };
    setSwipedJobs(updatedSwipedJobs);
    localStorage.setItem('swipedJobs', JSON.stringify(updatedSwipedJobs));

    if (direction === 'right') {
      const updatedBookmarks = [...bookmarkedJobs, job];
      setBookmarkedJobs(updatedBookmarks);
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
      setPopUpMessage('Bookmarked');
    } else {
      setPopUpMessage('Not Interested');
    }

    setCurrentJobIndex(prevIndex => prevIndex + 1);
    setTimeout(() => setPopUpMessage(''), 2000);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      const currentJob = jobs[currentJobIndex];
      if (currentJob) handleSwipe('left', currentJob);
    },
    onSwipedRight: () => {
      const currentJob = jobs[currentJobIndex];
      if (currentJob) handleSwipe('right', currentJob);
    },
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Display loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // If no more jobs to display
  if (currentJobIndex >= jobs.length) {
    return <p className="text-center p-4">No more jobs to display</p>;
  }

  const currentJob = jobs[currentJobIndex];
  const status = swipedJobs[currentJob.id];

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <h1 className="text-xl font-bold pb-5">Job Cards</h1>
      <div
        {...swipeHandlers}
        className={`border rounded-lg shadow-md cursor-pointer w-full max-w-md relative overflow-hidden transition-all duration-300 transform ${
          status ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <img
          src={currentJob.creatives?.[0]?.thumb_url}
          alt="Job"
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold">{currentJob.title}</h2>
          <h3 className="text-md font-semibold text-gray-700">
            Company: {currentJob.company_name}
          </h3>
          <p className="text-gray-600">
            Location: {currentJob.primary_details?.Place}
          </p>
          <p className="mt-2 text-gray-500">
            Swipe right to bookmark, swipe left to discard.
          </p>
        </div>
      </div>

      {/* Pop-Up Message */}
      {popUpMessage && (
        <div className="absolute top-4 right-4 bg-black text-white p-2 rounded shadow-lg transition-opacity duration-300">
          {popUpMessage}
        </div>
      )}
    </div>
  );
};

export default Jobs;


