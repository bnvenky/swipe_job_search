import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Bookmarks from './components/Bookmarks';
import Jobs from './components/Jobs';
import { useState } from 'react';
import { JobProvider } from './contexts/JobContext';

const App = () => {
  const [activeSection, setActiveSection] = useState('jobs');

  return (
    <JobProvider>
      <Router>
        <div className="flex bg-gray-100 flex-col h-screen">
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/bookmarks" element={<Bookmarks/>} />
              <Route path="/" element={activeSection === 'jobs' ? <Jobs /> : <Bookmarks />} />
            </Routes>
          </main>
          <nav className="bg-gray-900 fixed-bottom text-white py-4 shadow-md">
            <div className="flex justify-around items-center">
              <button
                onClick={() => setActiveSection('jobs')}
                className="hover:bg-gray-700 px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
              >
                Jobs
              </button>
              <button
                onClick={() => setActiveSection('bookmarks')}
                className="hover:bg-gray-700 px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
              >
                Bookmarks
              </button>
            </div>
          </nav>
        </div>
      </Router>
    </JobProvider>
  );
};

export default App;