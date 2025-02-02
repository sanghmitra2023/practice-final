import React, { useState, useEffect, useContext } from "react";
import Table from 'react-bootstrap/Table';
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const Appointments = (props) => {
	const { store, actions } = useContext(Context);

	console.log(store)

	useEffect(() => {
		fetch(process.env.BACKEND_URL +"/api/appointments")
            .then((result) => result.json())
            .then((data) => actions.setAppointmentData(data))
            .catch(error => console.error('Error fetching appointments', error));
        
        fetch(process.env.BACKEND_URL +"/api/dogs")
            .then((result) => result.json())
            .then((data) => actions.setDogData(data))
            .catch(error => console.error('Error fetching dogs', error));       
	}, []);

    const deleteAppointments = (appointment_id) => {
		fetch(process.env.BACKEND_URL + '/api/appointments/' + `${appointment_id}`, {
			method: "DELETE",
			headers: {      
				"Content-Type": "application/json"
			}
		})
        .then(result => {
            if (result.ok){
                alert('WE-Time Session cancelled')
            return result.json()  
            }})
		.then(data => {actions.setAppointmentData(data);
		})
		.catch(error => console.log('Error deleting the session', error))   
	}

    const formatDateTime = (dateTimeString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            timeZoneName: 'short' 
        };
        return new Date(dateTimeString).toLocaleString(undefined, options);
    };

	return (
		<div className="container footer-eighty">
            {((store.appointments.length) === 0) ? <h4>You have no upcoming WE-Time sessions</h4> :
            <Table striped hover>
                    <thead>
                        <tr>
                            <th>Date and time</th>
                            <th>Dog</th>
                            <th>Notes</th>
                            <th>Proceed</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    {store.appointments.map((appointment) => {
                        return (
                            <tbody key={appointment.id}>
                                <tr>
                                <td>{formatDateTime(appointment.time)}</td>
                               {store.dogs.map((dog) => {
                                    if (dog.id === appointment.dog_id){
                                        return (
                                            <td> {dog.name}</td>
                                        );}
                                    })}  
                                <td>{appointment.user_comment}</td>
                                
                                <td>
                                    <Link to='/checkout'>
						                <div className="text-success">Pay</div>
					                </Link>
                                </td>
                                <td>
						            <div name="appointment_id" value={appointment.id} className="text-danger" onClick={() => deleteAppointments(appointment.id)}style={{ cursor: 'pointer' }}>Cancel</div>
                                </td>
                                </tr>
                            </tbody>
                        );
                    })}
            </Table>
            }
		</div>
	);
};