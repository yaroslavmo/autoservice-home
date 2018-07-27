import React, {Component} from 'react';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { Button, Label, FormGroup } from 'reactstrap';

export default class clientForm extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {};
    }

    handleSubmit(event, errors, values) {

        this.setState({errors, values});
    }

    render() {
        return (
            <div>
                <AvForm onSubmit={this.handleSubmit}>
                    <AvGroup>
                        <AvField name="firstName" label="First name" required />
                        <AvInput name="lastName" label="Last name" required />
                        <AvFeedback>This is an error!</AvFeedback>
                    </AvGroup>
                    <AvGroup>
                        <AvField name="email" label="Email"/>
                        <AvFeedback>This is an error!</AvFeedback>
                    </AvGroup>
                    <AvGroup>
                        <AvInput name="carPlate" label="Car Plate"/>
                        <AvFeedback>This is an error!</AvFeedback>
                    </AvGroup>
                    <FormGroup>
                        <Button>Submit</Button>
                    </FormGroup>
                </AvForm>
                {this.state.values && <div>
                    <h5>Submission values</h5>
                    Invalid: {this.state.errors.join(', ')}<br />
                    Values: <pre>{JSON.stringify(this.state.values, null, 2)}</pre>
                </div>}
            </div>
        );
    }
}