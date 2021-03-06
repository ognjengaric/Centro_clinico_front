import React, {Component} from 'react';
import {Container, Form, Col, Button} from 'react-bootstrap'
import {serviceConfig} from '../appSettings.js'
import GenericTable from "./GenericTable.js"
import Header from "./Header.js"

function CheckupDateSearchPage() {

    const [data, setData] = React.useState([]);
    
    const columns = React.useMemo(
        () => [
          {
            Header: 'Checkup dates list',
            columns: [
              {
                Header: 'Id',
                accessor: 'id',
              },
              {
                Header: 'Date',
                accessor: 'date',
              },
              {
                Header: 'Start time',
                accessor: 'startTime',
              },
              {
                Header: 'End time',
                accessor: 'endTime',
              },
              {
                Header: 'Doctor',
                accessor: 'doctor',
              },
              {
                Header: 'Room',
                accessor: 'room',
              },
            ],
          },
        ],
        []
    )  

    const fetchData = React.useCallback(() => {
        const token = JSON.parse(localStorage.getItem('token'));

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token.accessToken}`},
        }

        fetch(`${serviceConfig.baseURL}/clinic/searchCheckupDates`, requestOptions)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response);
            }
            return response.json(); 
        })
        .then((data) =>  {
            setData(data);
            console.log(data);
        })
        .catch(response => {
            console.log(response);
        })

    }, []);


    return(
        <div>
            <Header/>
            <Container>
                <GenericTable columns={columns} data={data} fetchData={fetchData} handleClick={e=>function(){}}/>
            </Container>
        </div>
    )
    
}
export default CheckupDateSearchPage; 