import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./App.css";


function Project1() {
  const [username, setUsername] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Make a GET request to the server API
  //   axios
  //     .get("http://192.168.220.50:3000/api/users")
  //     .then((response) => {
  //       setUsername(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);
  
    
    return (
      <>
        <div className="bg"></div>
          <div className="appContainer">
            
          </div>
        
      </>
    );
}

export default Project1;
