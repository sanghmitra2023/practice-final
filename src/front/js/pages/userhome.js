import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import Card from 'react-bootstrap/Card';

export const UserHome = (props) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
		fetch(process.env.BACKEND_URL +"/api/appointments")
            .then((result) => result.json())
            .then((data) => actions.setAppointmentData(data))
            .catch(error => console.error('Error fetching appointments', error));
        
    fetch(process.env.BACKEND_URL +"/api/dog")
            .then((result) => result.json())
            .then((data) => actions.setDogData(data))
            .catch(error => console.error('Error fetching dogs', error));   
    
	}, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const favoriteCount = store.favorites.length;
  const plurals = favoriteCount !== 1;
  const cardColors = ['danger','success','info','warning','dark','light','secondary','primary'];
  const appointmentCount = store.appointments.length;
  const plural = appointmentCount !== 1;
  const cardColor = ['danger','success','info','warning','dark','light','secondary','primary'];

  return (
      <div className="container">
        <h4>Your private dashboard</h4>
          <br />
          <br />
          {((store.favorites.length) === 0) ? "" :
          <div>
              <h4 className="text-primary">You have {favoriteCount} Favorite {plurals ? 'Dogs' : 'Dog'} </h4>
            <div className="d-flex">
              {store.favorites.map((element, index) => {
              return (
                  <Card border={cardColors[index % cardColors.length]} style={{ width: '18rem', marginRight: "12px", boxShadow: "3px 3px 3px 2px #9E9E9E" }} >
                    {store.favorites.map((element)=>{
                      
                        })} 
                        <Card.Body>
                          <Card.Title>{element}</Card.Title>
                        </Card.Body>
                    
                  </Card>
                );
              })}
            </div>
          </div>
        }
      <br></br>
      <br></br>

          {((store.appointments.length) === 0) ? "" :
          <div>
              <h4 className="text-primary">You have {appointmentCount} upcoming WE-Time {plural ? 'sessions' : 'session'} </h4>
            <div className="d-flex">
              {store.appointments.map((appointment, index) => {
              return (
                  <Card border={cardColor[index % cardColor.length]} style={{ width: '18rem', marginRight: "12px", boxShadow: "3px 3px 3px 2px #9E9E9E" }} key={appointment.id}>
                    {store.dog.map((dog) => {
                      if (dog.id === appointment.dog_id){
                          return (
                              <Card.Header>{dog.name}</Card.Header>
                          );}
                      })}  
                    <Card.Body>
                      <Card.Title>{formatDate(appointment.time)}</Card.Title>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </div>
        }
        <br />
        <br />
      </div>
  );
};
