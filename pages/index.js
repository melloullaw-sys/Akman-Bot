'use client';

import React from 'react';
import data from '../data.js';

const HomePage = () => {
  return (
    <div>
      <h1>Data from ../data.js</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default HomePage;
