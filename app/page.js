"use client";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use the rear camera
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLocation(null);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      const img = document.getElementById("capturedPhoto");
      img.src = dataUrl;
      img.style.display = "block"; // Show the image
    }
  };

  const submitData = async () => {
    const data = {
      location: JSON.stringify(location),
      photo: document.getElementById("capturedPhoto").src, // Base64 or URL
    };

    const formData = new FormData();
    formData.append('location', data.location);
    formData.append('photo', data.photo); // Send as base64 or process as needed

    files.forEach((file) => {
      formData.append('files', file); // Append files
    });

    try {
      const response = await fetch('/app/api/users/submit', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        alert('Data submitted successfully!');
      } else {
        alert('Error submitting data');
      }
    } catch (error) {
      console.error("Error submitting data: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">I am Homepage</h1>
      <button
        onClick={getLocation}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Get System Detail
      </button>

      {location && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Location Details:</h2>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Open Camera
      </button>
      <button
        onClick={capturePhoto}
        type="button"
        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
      >
        Capture Photo
      </button>

      <button
        type="button"
        className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4 dark:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none dark:focus:ring-yellow-800"
        onClick={() => document.getElementById('fileInput').click()}
      >
        Get Files
      </button>
      <input
        id="fileInput"
        type="file"
        multiple
        style={{ display: 'none' }} // Hide the input
        onChange={handleFileChange}
      />

      {files.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Selected Files:</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      
      <video
        ref={videoRef}
        style={{ width: '100%', height: 'auto', marginTop: '10px' }}
        autoPlay
        muted
      ></video>
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }} // Hide canvas by default
      ></canvas>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Captured Photo:</h2>
        <img
          id="capturedPhoto"
          alt="Captured"
          style={{ width: '100%', height: 'auto', display: 'none' }}
        />
      </div>

      {/* <button
        onClick={submitData}
        type="button"
        className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
      >
        Submit All Data
      </button> */}

    </div>
  );
}
