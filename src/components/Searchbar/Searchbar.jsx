import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import './Searchbar.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Searchbar = ({ onSubmit }) => {
  const [searchValue, setSearchValue] = useState('');

  const HendleSubmit = event => {
    event.preventDefault();

    if (searchValue.trim() === '') {
      toast.warn('Введите запрос');
      return;
    }

    onSubmit(searchValue);

    setSearchValue('');
  };

  const hendleValueChange = event => {
    setSearchValue(event.currentTarget.value.toLowerCase());
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={HendleSubmit}>
        <button className="SearchForm-button" type="submit">
          <FaSearch style={{ marginRight: 5 }} />
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          className="SearchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={hendleValueChange}
        />
      </form>
    </header>
  );
};

export default Searchbar;
