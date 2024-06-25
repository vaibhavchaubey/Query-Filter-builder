import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const attributes = [
  'container_id',
  'container_name',
  'severity.number',
  'body',
  'trace_id',
  'span_id',
  'trace.flags',
  'severity.text',
];

const CloseIcon = (onClick) => (
  <svg
    className="h-4 w-4 ml-1 cursor-pointer"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const operations = ['=', '!=', 'IN', 'NOT_IN', 'LIKE', 'NOT_LIKE', 'CONTAINS'];

const SearchBar = () => {
  const [step, setStep] = useState(1);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [value, setValue] = useState('');
  const [searchQueries, setSearchQueries] = useState([]);

  const handleInputChange = (event) => {
    console.log(event.target.value);
    if (selectedAttribute === '') {
      setValue(event.target.value);
    } else {
      const index = event.target.value.split(' ').length - 1;
      const typedValue = event.target.value.split(' ')[index];
      setValue(`${typedValue}`);
    }
  };

  const handleSelect = (value) => {
    if (step === 1) {
      setSelectedAttribute(value);
      setStep(2);
    } else if (step === 2) {
      setSelectedOperation(value);
      setStep(3);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && step === 3) {
      setSearchQueries([
        ...searchQueries,
        {
          attribute: selectedAttribute,
          operation: selectedOperation,
          value,
          id: Date.now(),
        },
      ]);

      setSelectedAttribute('');
      setSelectedOperation('');
      setValue('');
      setStep(1);
    }
  };
  const getDropdownOptions = () => {
    if (step === 1) {
      const op = attributes.filter((attr) =>
        attr.toLowerCase().includes(value.toLowerCase())
      );

      return op;
    } else if (step === 2) {
      return operations.map((op) => `${selectedAttribute} ${op}`);
    }
    return [];
  };

  const handleRemove = (query) => {
    console.log('handleRemove: ', query);
    console.log('id: ', query.id);
    setSearchQueries(searchQueries.filter((o) => o.id !== query.id));
  };

  return (
    <div className="p-4">
      <div className="mb-4 relative">
        <div className="border border-gray-300 rounded flex flex-wrap p-2">
          {searchQueries.map((query, index) => (
            <button onClick={() => handleRemove(query)} key={query.id}>
              <div
                key={index}
                className="flex items-center bg-gray-200 px-2 py-1 m-1 rounded"
              >
                <span>{`${query.attribute} ${query.operation} ${query.value}`}</span>
                <CloseIcon />
              </div>
            </button>
          ))}
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 w-full"
            value={
              step === 1
                ? value
                : step === 2
                ? selectedAttribute
                : `${selectedAttribute} ${selectedOperation} ${value}`
            }
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </div>

        {step < 3 && (
          <ul className="absolute top-full left-0 w-full bg-white border max-h-60 overflow-y-auto z-10">
            {getDropdownOptions().map((option, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  const index = step === 1 ? 0 : 1;
                  handleSelect(option.split(' ')[index]);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
