import React from 'react';
import { SearchBar } from './components';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl mb-4 text-center font-bold">Query Filter Builder</h1>
        <SearchBar />
      </header>
    </div>
  );
}

export default App;
