import React, {Component} from 'react';
import {Container, Form, Col, Button} from 'react-bootstrap';
import {serviceConfig} from '../appSettings.js';
import ReactDOM from 'react-dom';
import ModalAlert from './ModalAlert.js'
import Header from './Header.js'


class EditClinicProfile extends React.Component{

        constructor(props){
            super(props);
            this.state = {
                _newCheckupDate : '',
                _newRoomName: '',
                _newCheckupType: '',
                _newCheckupTypeDuration: '',
                _newCheckupTypePrice: '',
                _checkupDates : [],
                _checkupTypes : [],
                _rooms : [],
                _doctors: [],
                _clinic: [],
                _selectedCheckupDate: '',
                _selectedCheckupType: '',
                _selectedRoom: '',
                _selectedDoctor: '',

                _name: '',
                _description: '',
                _street: '',
                _number: '',
                _city: '',
                _postcode: '',
                _country: '',

                message: "",
            };

            this.child = React.createRef();
            
            this.handleSubmit = this.handleSubmit.bind(this);

            this.handleAddDate = this.handleAddDate.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.handleAddDoctor = this.handleAddDoctor.bind(this);
            this.handleAddType = this.handleAddType.bind(this);
            this.handleAddRoom = this.handleAddRoom.bind(this);

            this.handleRemoveDate = this.handleRemoveDate.bind(this);
            this.handleRemoveType = this.handleRemoveType.bind(this);
            this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
            this.handleRemoveDoctor = this.handleRemoveDoctor.bind(this);
        }

        componentDidMount(){
            const token = JSON.parse(localStorage.getItem('token'));

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token.accessToken}`},
            }

            fetch(`${serviceConfig.baseURL}/clinic/getCheckupDates`, requestOptions)
            .then(response => {
                return response.json();   
            })
            .then((data) =>  {
                this.setState({_checkupDates: data});
                console.log(data);
            })
            .catch(response => {
                // const promise = Promise.resolve(response.json());
                // promise.then(data => {
                //     alert(data.message);
                // })
                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
            })

            fetch(`${serviceConfig.baseURL}/clinic/getCheckupTypes`, requestOptions)
            .then(response => {
                return response.json();   
            })
            .then((data) =>  {
                this.setState({_checkupTypes: data});  
            })
            .catch(response => {
                // const promise = Promise.resolve(response.json());
                // promise.then(data => {
                //     alert(data.message);
                // })
            })

            fetch(`${serviceConfig.baseURL}/clinic/getRooms`, requestOptions)
            .then(response => {
                return response.json();   
            })
            .then((data) =>  {
                this.setState({_rooms: data});  
            })
            .catch(response => {
                // const promise = Promise.resolve(response.json());
                // promise.then(data => {
                //     alert(data.message);
                // })
            })

            fetch(`${serviceConfig.baseURL}/clinic/getDoctors`, requestOptions)
            .then(response => {
                return response.json();   
            })
            .then((data) =>  {
                this.setState({_doctors: data});  
            })
            .catch(response => {
                // const promise = Promise.resolve(response.json());
                // promise.then(data => {
                //     alert(data.message);
                // })
            })
            if(this.state._name.length == 0){
                fetch(`${serviceConfig.baseURL}/clinic/getClinic`, requestOptions)
                .then(response => {
                    return response.json();   
                })
                .then((data) =>  {
                    console.log(data);
                    this.setState({_clinic: data});
                    this.setState({
                        _name: this.state._clinic.name,
                        _description: this.state._clinic.description,
                        _street: this.state._clinic.street,
                        _number: this.state._clinic.number,
                        _city: this.state._clinic.city,
                        _postcode: this.state._clinic.postcode,
                        _country: this.state._clinic.country,
                    })
                })
                .catch(response => {
                    // const promise = Promise.resolve(response.json());
                    // promise.then(data => {
                    //     alert(data.message);
                    // })
                })
            }

        }

        handleSubmit(e){
            e.preventDefault();
            const token = JSON.parse(localStorage.getItem('token'));

            const {_name,_description,_street,_number,_city,_postcode,_country} = this.state;

            const editClinicRequest = {
                name : _name,
                description : _description,
                street : _street,
                number : _number,
                city : _city,
                postcode : _postcode,
                country : _country,
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token.accessToken}`,
                },
                body: JSON.stringify(editClinicRequest)
            };

            fetch(`${serviceConfig.baseURL}/clinic/editClinic`, requestOptions)
            .then(response => {
                if(!response.ok){
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(() => {
                this.componentDidMount();
                this.setState({message:"Clinic information successfully changed."})
                this.child.current.showModal(); 
            })
            .catch(response => {
                const promise = Promise.resolve(response.json());
                promise.then(data => {
                    
                    this.setState({message:"Clinic information could not be changed."})
                    this.child.current.showModal(); 
                })
            })
        }

        handleChange(e) {
            const { id, value } = e.target;
            this.setState({ [id]: value });
        }

        handleAddType(){
            const token = JSON.parse(localStorage.getItem('token'));

            const {_newCheckupType, _newCheckupTypeDuration, _newCheckupTypePrice} = this.state;

            const checkupTypeRequest = {
                name : _newCheckupType,
                duration: _newCheckupTypeDuration,
                price : _newCheckupTypePrice,
            }

            if(_newCheckupType.length && _newCheckupTypeDuration.length && _newCheckupTypePrice.length){
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${token.accessToken}`,
                    },
                    body: JSON.stringify(checkupTypeRequest)
                };

                fetch(`${serviceConfig.baseURL}/clinic/addCheckupType`, requestOptions)
                .then(response => {
                    if(!response.ok){
                        return Promise.reject(response);
                    }
                    return response.statusText;
                })
                .then(() => {
                    this.componentDidMount();            
                    
                    this.setState({message:"A new checkup type has been added",
                                    _newCheckupType: '',
                                    _newCheckupTypeDuration: '',
                                    _newCheckupTypePrice: ''})
                    this.child.current.showModal(); 
                })
                .catch(response => {
                    const promise = Promise.resolve(response.json());
                    promise.then(data => {
                        
                    this.setState({message:"Checkup type could not be added.",
                                    _newCheckupType: '',
                                    _newCheckupTypeDuration: '',
                                    _newCheckupTypePrice: ''})
                    this.child.current.showModal(); 
                    })
                })
            }else{
                this.setState({message:"You have not filled in all the fields required for creating a new Checkup type!",
                                _newCheckupType: '',
                                _newCheckupTypeDuration: '',
                                _newCheckupTypePrice: ''});
                this.child.current.showModal();
            }
        }

        handleAddRoom(){
            const token = JSON.parse(localStorage.getItem('token'));
            const {_newRoomName} = this.state;

            const roomRequest = {
                name : _newRoomName,
            }
            if(_newRoomName.length){
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${token.accessToken}`,
                    },
                    body: JSON.stringify(roomRequest)
                };

                fetch(`${serviceConfig.baseURL}/clinic/addRoom`, requestOptions)
                .then(response => {
                    if(!response.ok){
                        return Promise.reject(response);
                    }
                    return response.statusText;
                })
                .then(() => {
                    this.componentDidMount();
                    
                    this.setState({message:"A new room has been added",
                                    _newRoomName: ''})
                    this.child.current.showModal(); 
                })
                .catch(response => {
                    const promise = Promise.resolve(response.json());
                    promise.then(data => {
                        
                    this.setState({message:"Room could not be added.",
                                    _newRoomName: ''})
                    this.child.current.showModal(); 
                    })
                })
            }else{
                this.setState({message:"You have not filled in all the fields required for creating a new Room",
                                _newRoomName: ''});
                this.child.current.showModal();
            }
        }

        handleAddDate(){
            
            this.props.history.push('/predefineCheckup');
        }

        handleAddDoctor(){
            this.props.history.push('/registerDoctor');
        }

        handleRemoveDate(){
            const token = JSON.parse(localStorage.getItem('token'));

            const checkupDateRequest = {
                id : ReactDOM.findDOMNode(this.refs._selectedCheckupDate).value,
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token.accessToken}`,
                },
                body: JSON.stringify(checkupDateRequest)
            };

            fetch(`${serviceConfig.baseURL}/clinic/removeCheckupDate`, requestOptions)
            .then(response => {
                if(!response.ok){
                    
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(() => {
                this.componentDidMount();
                
                this.setState({message:"Selected date removed successfully."})
                this.child.current.showModal(); 
            })
            .catch(response => {
                const promise = Promise.resolve(response.json());
                promise.then(data => {
                    
                    this.setState({message:"Date could not be removed."})
                    this.child.current.showModal(); 
                })
            })
        }

        handleRemoveType(){
            const token = JSON.parse(localStorage.getItem('token'));

            const checkupDateRequest = {
                id : ReactDOM.findDOMNode(this.refs._selectedCheckupType).value,
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token.accessToken}`,
                },
                body: JSON.stringify(checkupDateRequest)
            };

            fetch(`${serviceConfig.baseURL}/clinic/removeCheckupType`, requestOptions)
            .then(response => {
                if(!response.ok){
                    
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(() => {
                this.componentDidMount();
                
                this.setState({message:"Selected checkup type removed successfully."})
                this.child.current.showModal(); 
            })
            .catch(response => {
                const promise = Promise.resolve(response.json());
                promise.then(data => {
                    
                    this.setState({message:data.message})
                    this.child.current.showModal(); 
                })
            })
        }

        handleRemoveRoom(){
            const token = JSON.parse(localStorage.getItem('token'));

            const checkupDateRequest = {
                id : ReactDOM.findDOMNode(this.refs._selectedRoom).value,
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token.accessToken}`,
                },
                body: JSON.stringify(checkupDateRequest)
            };

            fetch(`${serviceConfig.baseURL}/clinic/removeRoom`, requestOptions)
            .then(response => {
                if(!response.ok){
                    
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(() => {
                this.componentDidMount();
                
                this.setState({message:"Selected room removed successfully."})
                this.child.current.showModal(); 
            })
            .catch(response => {
                const promise = Promise.resolve(response.json());
                promise.then(data => {
                    this.setState({message:data.message})
                    this.child.current.showModal(); 
                })
            })
        }

        handleRemoveDoctor(){
            const token = JSON.parse(localStorage.getItem('token'));

            const checkupDateRequest = {
                id : ReactDOM.findDOMNode(this.refs._selectedDoctor).value,
            }

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token.accessToken}`,
                },
                body: JSON.stringify(checkupDateRequest)
            };

            fetch(`${serviceConfig.baseURL}/clinic/removeDoctor`, requestOptions)
            .then(response => {
                if(!response.ok){
                    
                    return Promise.reject(response);
                }
                return response.statusText;
            })
            .then(() => {
                this.componentDidMount();
                
                this.setState({message:"Selected doctor removed successfully."})
                this.child.current.showModal(); 
            })
            .catch(response => {
                const promise = Promise.resolve(response.json());
                promise.then(data => {
                    this.setState({message: data.message})
                    this.child.current.showModal(); 
                })
            })
        }

        render(){
        const {_newCheckupDate, _checkupDates, _checkupTypes, _rooms, _doctors, _newRoomName, _newCheckupType, _newCheckupTypeDuration, _newCheckupTypePrice, _clinic, _name, _description, _street, _number, _city, _postcode, _country} = this.state;
        return(
            <div>
            <Header/>
            <Container>
                <div className='register-div'>
                    <h2>Edit profile of the clinic</h2>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} md="6">
                                <Form.Label>Clinic name</Form.Label>
                                <Form.Control
                                    required
                                    id="_name"
                                    type="text"
                                    placeholder="Clinic name"
                                    value={_name}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    required
                                    id="_description"
                                    type="text"
                                    placeholder="Description"
                                    value = {_description}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                        </Form.Row>
                        
                        <Form.Row>
                            <Form.Label>Predefined checkups</Form.Label>
                        </Form.Row>

                        <Form.Row>
                            
                            <Form.Group as={Col} md="8">
                                
                                <Form.Control as="select" ref='_selectedCheckupDate'>
                                        {_checkupDates.map((e, key) => {
                                        return <option key={key} value={e.id}>[Doc: {e.doctor}][Room: {e.room}][Date: {e.date}][{e.startTime}-{e.endTime}]</option>;
                                        })}
                                    </Form.Control>
                            </Form.Group>

                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="danger" onClick={this.handleRemoveDate}>Remove</Button>
                                </Form.Group>  
                            

                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="success" onClick={this.handleAddDate}>Add</Button>
                                
                                </Form.Group>
                                                 
                            </Form.Row>

                        <Form.Row>
                            <Form.Label>Doctors list</Form.Label>
                        </Form.Row>

                        <Form.Row>
                            
                            <Form.Group as={Col} md="4">
                                
                                <Form.Control as="select" ref='_selectedDoctor'>
                                    {_doctors.map((e, key) => {
                                            return <option key={key} value={e.id}>{e.name} {e.surname}</option>;
                                        })}
                                    </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="danger" onClick={this.handleRemoveDoctor}>Remove</Button>
                            </Form.Group>
                            

                            <Form.Group as={Col} md="4">
                            </Form.Group>

                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="success" onClick={this.handleAddDoctor}>Add</Button>
                                
                                </Form.Group>                       
                            </Form.Row>
                            
                        
                        <Form.Row>
                            <Form.Label>Rooms list</Form.Label>
                        </Form.Row>

                        <Form.Row>
                            
                            <Form.Group as={Col} md="4">
                                
                                <Form.Control as="select" ref='_selectedRoom'>
                                    {_rooms.map((e, key) => {
                                            return <option key={key} value={e.id}>{e.name}</option>;
                                        })}
                                    </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="danger" onClick={this.handleRemoveRoom}>Remove</Button>
                                </Form.Group> 
                            
                            <Form.Group as={Col} md="4">
                                <Form.Control
                                    id="_newRoomName"
                                    value={_newRoomName}
                                    type="text"
                                    placeholder="NewRoomName"
                                    onChange={this.handleChange}
                                />
                            </Form.Group>

                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="success" onClick={this.handleAddRoom}>Add</Button>
                                
                                </Form.Group>
                                                  
                            </Form.Row>

                        <Form.Row>
                            <Form.Label>Checkup types</Form.Label>
                        </Form.Row>

                        <Form.Row>
                            
                            <Form.Group as={Col} md="4">
                                
                                <Form.Control as="select" ref='_selectedCheckupType'>
                                        {_checkupTypes.map((e, key) => {
                                            return <option key={key} value={e.id}>{e.name}</option>;
                                        })}
                                    </Form.Control>
                            </Form.Group>
                            
                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="danger" onClick={this.handleRemoveType}>Remove</Button>
                                </Form.Group>  

                            <Form.Group as={Col} md="4">
                                <Form.Control
                                    id="_newCheckupType"
                                    value={_newCheckupType}
                                    type="text"
                                    placeholder="Type"
                                    onChange={this.handleChange}
                                />
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Control
                                        id="_newCheckupTypeDuration"
                                        value={_newCheckupTypeDuration}
                                        type="text"
                                        placeholder="Duration"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Control
                                        id="_newCheckupTypePrice"
                                        value={_newCheckupTypePrice}
                                        type="text"
                                        placeholder="Price"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group as={Col} md="2">
                                <Form.Label></Form.Label>
                                <Button variant="success" onClick={this.handleAddType}>Add</Button>
                                
                                </Form.Group>
                                                 
                            </Form.Row>
                        
                        <Form.Row>
                        <Form.Group as={Col} md="8">
                                <Form.Label>Street name</Form.Label>
                                <Form.Control
                                    required
                                    id="_street"
                                    type="text"
                                    placeholder="Street name"
                                    defaultValue = {_clinic.street}
                                    value = {_street}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Street number</Form.Label>
                                <Form.Control
                                    required
                                    id="_number"
                                    type="text"
                                    placeholder="Street number"
                                    value = {_number}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} md="4">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    required
                                    id="_city"
                                    type="text"
                                    placeholder="City"
                                    value = {_city}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Postcode</Form.Label>
                                <Form.Control
                                    required
                                    id="_postcode"
                                    type="text"
                                    placeholder="Postcode"
                                    value = {_postcode}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Country</Form.Label>
                                <Form.Control
                                    required
                                    id="_country"
                                    type="text"
                                    placeholder="Country"
                                    value = {_country}
                                    onChange = {this.handleChange}
                                />
                            </Form.Group>
                        </Form.Row>
                        <div className="text-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                        </div>
                    </Form>
                </div>
                <ModalAlert message={this.state.message} ref={this.child}/>
            </Container>
            </div>
        );
        }
    
}
export default EditClinicProfile; 