import { useEffect, useState } from 'react';
import { useJob } from '../contexts/JobContext';

const Bookmarks = () => {
  const { bookmarkedJobs, setBookmarkedJobs } = useJob();
  const [isLoading, setIsLoading] = useState(true);

  // Retrieve bookmarked jobs from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedJobs')) || [];
    setBookmarkedJobs(savedBookmarks);
    setIsLoading(false);
  }, [setBookmarkedJobs]);

  // Function to remove a job from bookmarks
  const handleRemoveBookmark = (jobId) => {
    const updatedBookmarks = bookmarkedJobs.filter(job => job?.id !== jobId);
    setBookmarkedJobs(updatedBookmarks);
    localStorage.setItem('bookmarkedJobs', JSON.stringify(updatedBookmarks));
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Bookmarked Jobs</h2>
      {bookmarkedJobs.length === 0 && <p>No jobs bookmarked yet</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedJobs.map((job, index) => {
          // Check if job is null or undefined
          if (!job) return null;

          return (
            <div key={`${job.id}-${index}`} className="border rounded-lg p-4 shadow-lg relative bg-white">
              {/* Safely check if job.creatives exists before rendering */}
              {job.creatives?.[0]?.thumb_url && (
                <div className="mb-4 w-full h-40 rounded-lg overflow-hidden">
                  <img src={job.creatives[0].thumb_url} alt="Job thumbnail" className="object-cover w-full h-full" />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p><strong>Location:</strong> {job.primary_details?.Place || 'N/A'}</p>
              <p><strong>Salary:</strong> {job.primary_details?.Salary || 'N/A'}</p>
              <button
                className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full"
                onClick={() => handleRemoveBookmark(job.id)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookmarks;


