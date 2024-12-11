import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function DictionaryApp() {
  // State for data
  const [data, setData] = useState("");
  // State for searching the word
  const [searchWord, setSearchWord] = useState("");

  // Function to search the word via button
  function getMeaning() {
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setData(response.data[0]);
        } else {
          Swal.fire('Word not found in the dictionary.');
        }
      })
      .catch(() => {
        Swal.fire('Error retrieving data. Please try again later.');
      });
  }

  // Function for pronunciation
  const playAudio = () => {
    const audioUrl = data?.phonetics?.[0]?.audio;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      Swal.fire('Audio not available for this word.');
    }
  };

  return (
    <div>
      <Container className="mx-auto mt-5 dict-app">
        <h1 className="text-center text-white">Dictionary App</h1>
        <hr className="border border-1 w-100 text-white" />
        <center>
          <div className="form-group mt-3 w-50 mx-auto">
            <input
              type="text"
              className="form-control w-75 text-white bg-dark"
              placeholder="Enter any word here ...."
              onChange={(e) => setSearchWord(e.target.value)}
              style={{ color: "white" }}
            />
          </div>

          <div className="form-group mt-3 w-50 mx-auto">
            <button
              type="button"
              onClick={getMeaning}
              className="btn btn-md btn-dark text-white w-75"
            >
              <span className="bi bi-search"></span>
            </button>
          </div>

          {data && (
            <div className="showresult mt-4">
              <h1 className="text-white">
                {data.word}{" "}
                <button
                  type="button"
                  className="btn btn-link text-white"
                  onClick={playAudio}
                >
                  <span
                    className="bi bi-megaphone-fill text-white"
                    style={{ border: "1px solid white", borderRadius: "50%", padding: "5px" }}
                  ></span>
                </button>
              </h1>
              <h3 className="text-center text-white">Part of Speech</h3>
              <p className="text-white">{data.meanings[0]?.partOfSpeech || "N/A"}</p>
              <h3 className="text-center text-white">Definition</h3>
              <p className="text-white">{data.meanings[0]?.definitions[0]?.definition || "N/A"}</p>
              <h3 className="text-center text-white">Example</h3>
              <p className="text-white">{data.meanings[0]?.definitions[0]?.example || "N/A"}</p>
            </div>
          )}
        </center>
      </Container>
    </div>
  );
}
