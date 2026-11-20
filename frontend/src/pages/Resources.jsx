import React, { useState } from "react";
import "../styles/resources.css"

const allResources = [
  { name: "Khan Academy", description: "Free online courses, lessons, and practice", category: "Free", link: "https://www.khanacademy.org" },
  { name: "Coursera", description: "Online courses and degrees from top universities", category: "Online", link: "https://www.coursera.org" },
  { name: "edX", description: "Free online courses from the best universities", category: "Online", link: "https://www.edx.org" },
  { name: "Codecademy", description: "Interactive coding lessons and projects", category: "Interactive", link: "https://www.codecademy.com" },
  { name: "Duolingo", description: "Free language learning platform", category: "Free", link: "https://www.duolingo.com" },
  { name: "TED-Ed", description: "Video lessons worth sharing", category: "Interactive", link: "https://ed.ted.com" },
  { name: "MIT OpenCourseWare", description: "Free MIT course materials", category: "Free", link: "https://ocw.mit.edu" },
  { name: "Google Scholar", description: "Search for scholarly literature", category: "Computational", link: "https://scholar.google.com" },
  { name: "Wolfram Alpha", description: "Computational knowledge engine", category: "Computational", link: "https://www.wolframalpha.com" },
  { name: "Project Gutenberg", description: "Free e-books", category: "Free", link: "https://www.gutenberg.org" },
  { name: "FutureLearn", description: "Online courses from top universities and cultural institutions", category: "Online", link: "https://www.futurelearn.com" },
  { name: "OpenLearn", description: "Free learning from The Open University", category: "Free", link: "https://www.open.edu/openlearn" }
];

const categories = ["All", "Free", "Online", "Offline", "Interactive", "Computational"];

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = allResources.filter(
    (res) =>
      (selectedCategory === "All" || res.category === selectedCategory) &&
      (res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       res.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page resources-page">
      <h1 className="title">Resources</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="cards-row">
        {filteredResources.length > 0 ? (
          filteredResources.map((res, i) => (
            <div key={i} className="resource-card">
              <h3 className="card-name">{res.name}</h3>
              <p className="card-description">{res.description}</p>
              <a href={res.link} target="_blank" rel="noopener noreferrer" className="card-btn">Visit Resource</a>
            </div>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default Resources;
