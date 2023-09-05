import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [backendData, setBackendData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5173/api", {
      headers: {
        "Accept": "application/json",
      },
    })
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBackendData(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle the error here, e.g., display an error message to the user
      });
  }, []);
  return (
    <>
      {backendData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        backendData.map((user, i) => <p key={i}>{user}</p>)
      )}
    </>
  );
}

export default App;