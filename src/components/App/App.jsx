import React, { useState, useEffect } from 'react';

import './App.css';

import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import Modal from 'components/Modal/Modal';
import { getImages } from '../services/imagesApi';
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [imagesArr, setImagesArr] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (searchValue === '') {
      return;
    }

    if (page === 1) {
      setImagesArr([]);
    }

    setLoading(true);

    try {
      getImages(searchValue, page, perPage).then(images => {
        if (images.hits.length === 0) {
          toast.error(
            `No pictures ${searchValue}. Please, try another request`
          );
          return setImagesArr([]);
        }

        setImagesArr(prevState => [
          ...prevState,
          ...images.hits.map(({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })),
        ]);

        setTotalPages(images.totalHits / perPage);
      });
    } catch (error) {
      setError(error);
      toast.error(
        `Whoops, something went wrong: ${error.message}. Try new request`
      );
    } finally {
      setLoading(false);
    }
  }, [searchValue, page, perPage, totalPages]);

  const HendleFormSubmit = searchValue => {
    setSearchValue(searchValue);
    setPage(1);
    setImagesArr([]);
    setLoading(false);
    setError(null);
  };

  const LoadMoreBtnCklick = () => {
    setPage(prevState => prevState + 1);
    if (page > totalPages) {
      return toast.error(`No more pictures ${searchValue}. Try new request`);
    }
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const onModal = ({ largeImageURL, tags }) => {
    setLargeImageURL(largeImageURL);
    setTags(tags);

    toggleModal();
  };

  const renderLoadMoreBtn = imagesArr.length > 0 && page < totalPages;

  return (
    <div className="App">
      <Searchbar onSubmit={HendleFormSubmit} />
      {loading && <Loader />}
      <ImageGallery imagesArr={imagesArr} onClick={onModal} />
      {renderLoadMoreBtn && <Button onClick={LoadMoreBtnCklick} />}
      {showModal && (
        <Modal onClose={toggleModal}>
          <img src={largeImageURL} alt={tags} />
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default App;

// Your API key: 25802713-e226c9b2d7aa04108ed842121

// https://pixabay.com/api/?q=cat&page=1&key=your_key&image_type=photo&orientation=horizontal&per_page=12
