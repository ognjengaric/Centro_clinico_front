import React, {Component} from 'react';
import {Container, Form, Col, Button, Table} from 'react-bootstrap';

class CheckupTypeSearchTable extends Component{

    constructor(props) {
        super(props);
        console.log(this.props)
    }
    
    renderTableData() {
        return this.props._checkuptypes.map((e, index) => {
           return (
              <tr key={e.id}>
                 <td>{e.id}</td>
                 <td>{e.name}</td>
              </tr>
           )
        })
    }
    render(){
    return (
         <Container>
            <div>
               <Table  striped bordered hover id='_checkuptypes'>
                 <tbody>
                    {this.renderTableData()}
                 </tbody>
               </Table>
            </div>
        </Container>
     )
    }
}



export default CheckupTypeSearchTable; 