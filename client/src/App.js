import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);

  const postFile = () => {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`/api/v1/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setImages([...images, data]))
      .catch((err) => console.error(err));
  };

  const fetchPost = () => {
    fetch(`/api/v1/upload`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error(err));
  };

  const deletePost = (id) => {
    fetch(`/api/v1/image/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(() => {
        const filterImage = images.filter((image) => image._id !== id);

        setImages(filterImage);
      });
  };

  useEffect(() => {
    fetchPost();
  }, [images]);

  const handleSubmit = (e) => {
    e.preventDefault();
    postFile();
  };

  return (
    <div className='App container'>
      <div className='row'>
        <div className='col-md-6 m-auto border p-3'>
          <h1 className='text-center'>GridFS File Uploads</h1>
          <form onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className='custom-file mb-3'>
              <input
                type='file'
                name='file'
                id='file'
                onChange={(e) => setFile(e.target.files[0])}
                className='custome-file-input form-control '
              />
            </div>
            <input
              type='submit'
              value='Submit'
              className='btn btn-primary btn-block'
            />
          </form>

          {images.length > 0 &&
            images.map(({ filename, _id }) => (
              <div className='card card-image mt-3' key={_id}>
                <img
                  src={`/api/v1/image/${filename}`}
                  className='img-fluid'
                  alt=''
                />
                <button
                  className='btn btn-block btn-danger mt-2'
                  onClick={() => deletePost(_id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
