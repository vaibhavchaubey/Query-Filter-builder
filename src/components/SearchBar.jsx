import React, { useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';
import CloseIcon from './CloseIcon';

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

const operations = ['=', '!=', 'IN', 'NOT_IN', 'LIKE', 'NOT_LIKE', 'CONTAINS'];

const SearchBar = () => {
  const [step, setStep] = useState(1);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [value, setValue] = useState('');
  const [valueQuery, setValueQuery] = useState('');
  const [searchQueries, setSearchQueries] = useState([]);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    if (selectedAttribute === '') {
      setValueQuery(event.target.value);
    } else {
      const index = event.target.value.split(' ').length - 1;
      const typedValue = event.target.value.split(' ')[index];
      setValue(`${typedValue}`);
      setValueQuery('');
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
    inputRef.current.focus();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Backspace' && step === 2) {
      setSelectedAttribute('');
      setValue('');
      setStep(1);
    }
    if (event.key === 'Backspace' && step === 3 && value === '') {
      setSelectedOperation('');
      setStep(2);
    }
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
        attr.toLowerCase().includes(valueQuery.toLowerCase())
      );

      return op;
    } else if (step === 2) {
      return operations.map((op) => `${selectedAttribute} ${op}`);
    }
    return [];
  };

  const handleRemove = (query) => {
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
                ? valueQuery
                : step === 2
                ? selectedAttribute
                : `${selectedAttribute} ${selectedOperation} ${value}`
            }
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            ref={inputRef}
            onClick={() => setIsDropDownOpen(true)}
          />
        </div>

        {step < 3 && isDropDownOpen && (
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
