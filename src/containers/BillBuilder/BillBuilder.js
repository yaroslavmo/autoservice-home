import React, { Component } from 'react';
import Aux from "../../hoc/Auxiliary";
import classes from './BillBuilder.css'
import {
    Form,
    FormGroup,
    Label,
    FormText,
    Button,
    Container,
    Table, Collapse, Fade,
} from 'reactstrap';
import Clients from "../../components/Clients/Clients";
import BillBuilderServices from "./BillBuilderServices/BillBuilderServices";
import axios from "axios";


class BillBuilder extends Component {

    state = {
        client: {},
        isNewClient: true,
        orderedServices: [],
        servicesFadeIn: false,
        clientCollapsed: false,
        newClientCollapsed: false,
        total: 0,
        totalDiscount: 0
    };

    toggleClients = () => {
        this.setState({ clientCollapsed: !this.state.clientCollapsed, isNewClient: false });
        console.log(this.state.isNewClient)
    };

    toggleNewClients = () => {
        this.setState({ newClientCollapsed: !this.state.newClientCollapsed });
        if (!this.state.newClientCollapsed === true) {
            this.setState({ client: {}, isNewClient: true, servicesFadeIn: false })
        }
        console.log(this.state.isNewClient)


    };

    clientClick = (client) => {
        this.setState({ client: client, servicesFadeIn: true });
        this.toggleClients();
    };

    deleteClient = () => {
        this.setState({ client: {}, servicesFadeIn: false })
    };


    setClient = ({ target: { name, value } }) => {
        this.setState({
            client: {
                ...this.state.client,
                [ name ]: value
            }, servicesFadeIn: true
        });
    };


    serviceAddClick = (service) => {
        let servicesCopy = [ ...this.state.orderedServices ];
        servicesCopy.push(service);
        servicesCopy = Array.from(new Set(servicesCopy));
        // this.countTotal();
        this.setState({ orderedServices: servicesCopy },
            () => this.setState({ total: this.countTotal() },
                () => this.setState({ totalDiscount: this.countDiscount() })));
        console.log(this.state)

    };

    deleteServiceHandler = (service) => {
        let servicesCopy = [ ...this.state.orderedServices ];
        let index = servicesCopy.indexOf(service);
        servicesCopy.splice(index, 1);
        this.setState({ orderedServices: [ ...servicesCopy ] },
            () => this.setState({ total: this.countTotal() },
            () => this.setState({ totalDiscount: this.countDiscount()})
        ));
    };

    discountAmountCheck = (number) => {
        let amount = 0;
        if (number === 0) {
            return 0
        } else {
            number = number.amount
        }
        if (number > 1 && number < 100) {
            amount = ( Number.parseFloat(number).toFixed(2) / 100 ).toFixed(2);
        }
        if (number <= 1 && number > 0) {
            number = Number.parseFloat(number).toFixed(2);
            amount = number;
        }
        return amount;
    };
    countDiscount = () => {
        let totalDiscount = this.state.orderedServices.reduce(
            (totalD, service) => {
                let discount = this.discountAmountCheck(service.category.discount || 0);
                return totalD + ( service.price * ( discount || 0 ) )
            }
            , 0);
        if (totalDiscount === 0) {
            this.setState({ totalDiscount: 0 })
        }
        return totalDiscount
    };

    countTotal = () => {
        let orderedServices = [ ...this.state.orderedServices ];

        let total = orderedServices.reduce((total, num) => {
            return total + ( num.price || 0 )
        }, 0);
        // this.setState({ total: total });
        return total;
    };

    submitNewClient = () => {
        return axios.post('https://powerful-savannah-20859.herokuapp.com/api/clients', this.state.client)
            .then(function (response) {
                return response.data
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    submit = (client) => {
        let reqContent = {
            billClient: client,
            billServices: this.state.orderedServices,
            total: this.state.total - this.state.totalDiscount,
            totalDiscount: this.state.totalDiscount
        };
        console.log(reqContent)
        return axios.post('https://powerful-savannah-20859.herokuapp.com/api/journal', reqContent)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    submitBill = (e) => {
        e.preventDefault()

        if (this.state.isNewClient) {
            this.submitNewClient()
                .then((res) => {
                    this.submit(res)
                        .then(() => {
                            this.props.history.push(`/journal`)
                        })
                })

        } else {
            this.submit(this.state.client)
                .then((res) => {
                    this.props.history.push({
                        pathname: '/journal',
                    state: { detail: res.data }
                    })
                })
        }
    };


    render() {
        return (
            <Aux>
                <Fade in={true} timeout={200} className="mt-3">
                    <Form className={classes.BillBuilder} id={"billBuilderForm"}>
                        <FormGroup>
                            <Container className='text-center'>
                                <Button disabled={this.state.newClientCollapsed} className='row col' color="dark"
                                        onClick={this.toggleClients}
                                        style={{ marginBottom: '1rem' }}>
                                    Existing client
                                </Button>
                                <Fade in={this.state.clientCollapsed} timeout={150} className="mt-3">
                                    <Collapse isOpen={this.state.clientCollapsed}>
                                        <Container className="text-center">
                                            <Table hover id='Clients'
                                                   className={[ "", classes.clientsTable ].join(' ')}>
                                                <Clients isBuilder={true}
                                                         clientClick={this.clientClick}/></Table>
                                        </Container>
                                    </Collapse>
                                </Fade>


                                <Button disabled={this.state.clientCollapsed} className='row col' color="dark"
                                        onClick={this.toggleNewClients}
                                        style={{ marginBottom: '1rem' }}>New client</Button>

                                <Collapse isOpen={this.state.newClientCollapsed}>

                                    <Container>
                                        <Label>New Client:</Label>

                                        <input type="text"
                                               onChange={this.setClient} className={classes.newClientInput}
                                               required placeholder="First name" name="firstName"
                                               value={this.state.client.firstName ? this.state.client.firstName : ''}/>
                                        <input type="text"
                                               onChange={this.setClient} className={classes.newClientInput}
                                               required placeholder="Last name" name="lastName"
                                               value={this.state.client.lastName ? this.state.client.lastName : ''}/>
                                        <input type="text"
                                               onChange={this.setClient} className={classes.newClientInput}
                                               placeholder="Email" name="email"
                                               value={this.state.client.email ? this.state.client.email : ''}/>
                                        <input type="text"
                                               onChange={this.setClient} className={classes.newClientInput}
                                               required placeholder="CarPlate" name="carPlate"
                                               value={this.state.client.carPlate ? this.state.client.carPlate : ''}/>
                                        <FormText>This will create new client.</FormText>
                                    </Container>
                                </Collapse>
                            </Container>
                            {Object.values(this.state.client).length !== 0 ?
                                <Fade in={Object.values(this.state.client).length !== 0} timeout={200} className="mt-3">
                                    <Container>
                                        <strong>Client</strong>
                                        <Table className="flex">
                                            <tbody>
                                            <tr>
                                                <td><strong>First name: </strong>{this.state.client.firstName}</td>
                                                <td><strong>Last name: </strong>{this.state.client.lastName}</td>
                                                <td><strong>Email: </strong>{this.state.client.email}</td>
                                                <td><strong>Car Plate: </strong>{this.state.client.carPlate ?
                                                    this.state.client.carPlate.toUpperCase() : null}</td>
                                                <td className="text-right">
                                                    <button type="button" className="close text-right"
                                                            aria-label="Close"
                                                            onClick={this.deleteClient}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                        <hr/>
                                    </Container>
                                </Fade>
                                : null}
                        </FormGroup>

                        <FormGroup>
                            {Object.values(this.state.client).length >= 4 ?
                                <Fade in={this.state.servicesFadeIn} timeout={200} className="mt-3">
                                    <Container>
                                        <strong>Services</strong>
                                        <BillBuilderServices addService={this.serviceAddClick}
                                                             onDelete={this.deleteServiceHandler}
                                        />
                                        <hr/>
                                    </Container>
                                </Fade>
                                : null}
                        </FormGroup>
                        <FormGroup>
                            <Container>
                                <div style={{ display: "flex", alignItems: "center" }}><h1>Total: </h1>
                                    <h3 style={{
                                        marginBottom: "0",
                                        marginLeft: "10px"
                                    }}> {this.state.total} {this.state.totalDiscount === 0 ? null : ' - ' + this.state.totalDiscount + ' discount = ' +
                                        ( this.state.total - this.state.totalDiscount )}</h3>
                                </div>
                            </Container>
                        </FormGroup>
                        <FormGroup check row>
                            <Container>
                                <Button disabled={!this.state.total} onClick={(e) => this.submitBill(e)}>Create
                                    Bill</Button>
                            </Container>
                        </FormGroup>
                    </Form>
                </Fade>

            </Aux>
        );
    }
}

export default BillBuilder;
