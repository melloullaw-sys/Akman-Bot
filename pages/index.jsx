import React from 'react';
import data from '../data.js';

const Portfolio = () => {
    return (
        <div>
            <h1>My Portfolio</h1>
            {data.portfolioItems.map(item => (
                <div key={item.id} className="portfolio-item">
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">View Project</a>
                </div>
            ))}
        </div>
    );
};

export default Portfolio;