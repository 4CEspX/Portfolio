import axios from "axios";
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const [username, setUsername] = useState([]);

  useEffect(() => {
    // Make a GET request to the server API
    axios
      .get("http://192.168.220.50:3000/api/users")
      .then((response) => {
        setUsername(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <>
      <div className="appContainer">
        <table className="studentInfo">
          <tr>
          </tr>
          {/* {username.map((user) => (
            <tr key={user.id}>
              <td>
                <p>{user.name}</p>
              </td>
              <td>
                <p>{user.klass}</p>
              </td>
              <td>
                <p>{user.password}</p>
              </td>
            </tr>
          ))} */}
        </table>
      </div>
    </>
  );
}

export default App;
