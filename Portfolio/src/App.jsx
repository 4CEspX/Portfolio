// import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./App.css";


function App() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const proj1click = () => {
    setIsClicked(true);
    
    setTimeout(() => {
      navigate('/project1');
    }, 400);
  };
  const proj2click = () => {
    setIsClicked(true);
    
    setTimeout(() => {
      navigate('/project1');
    }, 400);
  };
  const proj3click = () => {
    setIsClicked(true);
    
    setTimeout(() => {
      navigate('/project1');
    }, 400);
  };
  const proj4click = () => {
    setIsClicked(true);
    
    setTimeout(() => {
      navigate('/project1');
    }, 400);
  };

    return (
      <>
        <div className="bg"></div>
          <div
            className="appContainer">
            <div className="aboutContent">
              <div className="div1">
                <img
                  src="../src/assets/images/placeholder_person.png"
                  className="image"
                ></img>
              </div>
              <div className="div2">
                <h1>Simon Jonasson</h1>
                <p>
                  I am a 19 year old guy from sweden who loves working on small
                  projects
                </p>
                <p>
                  I love everything about computers and I am eagered to learn more
                </p>
              </div>
            </div>
            <div className="projects">
              <div className="empty"></div>
            <div className={"project1 ${isClicked ? 'clicked' : ''}"} onClick={proj1click }>Project 1</div>
              <div className={"project2 ${isClicked ? 'clicked' : ''}"} onClick={proj2click}>Project 2</div>
              <div className="empty"></div>
              <div className="empty"></div>
              <div className={"project3 ${isClicked ? 'clicked' : ''}"} onClick={proj3click}>Project 3</div>
              <div className={"project4 ${isClicked ? 'clicked' : ''}"} onClick={proj4click}>Project 4</div>
              <div className="empty"></div>
            </div>

            <tr></tr>
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
          </div>
        
      </>
    );
}

export default App;
