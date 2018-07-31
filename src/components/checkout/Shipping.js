import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Shipping extends Component {
  constructor(props) {
    super(props);
    if (Object.keys(this.props.address).length)
      this.state = this.props.address;
    else {
      this.state = {
        givenName: "",
        familyName: "",
        address1: "",
        address2: "",
        locality: "",
        region: "",
        postalCode: ""
      };
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name] : value });
  }

  submitAddress = () => {
    this.props.handleChange("address", this.state);
    this.props.createOrder(this.state);
    this.props.changePane();
  }

  render() {
    return (
      <div>
        <TextField
          autoComplete="given-name"
          label="First Name"
          value={this.state.givenName}
          onChange={(e) => this.handleChange('givenName', e.target.value)}
          margin="normal"
          style={{ marginRight: "50px" }}
        />
        <TextField
          autoComplete="family-name"
          label="Last Name"
          value={this.state.familyName}
          onChange={(e) => this.handleChange('familyName', e.target.value)}
          margin="normal"
        />

        <TextField
          autoComplete="shipping address-line1"
          label="Street Address"
          value={this.state.address1}
          onChange={(e) => this.handleChange('address1', e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          autoComplete="shipping address-line2"
          label="Apt, suite, etc (optional)"
          value={this.state.address2}
          onChange={(e) => this.handleChange('address2', e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          autoComplete="shipping locality"
          label="City"
          value={this.state.locality}
          onChange={(e) => this.handleChange('locality', e.target.value)}
          margin="normal"
          style={{ marginRight: "50px" }}
        />
        <TextField
          autoComplete="shipping region"
          label="State"
          value={this.state.region}
          onChange={(e) => this.handleChange('region', e.target.value)}
          margin="normal"
          style={{ marginRight: "50px" }}
        />
        <TextField
          autoComplete="shipping postal-code"
          label="Zip"
          value={this.state.postalCode}
          onChange={(e) => this.handleChange('postalCode', e.target.value)}
          margin="normal"
        />
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          All orders are shipped USPS Priority, and delivered in 2-5 business days.
        </div>
        <Button variant="raised" color="primary"
          style={{ marginTop: "20px" }}
          disabled={!this.state.postalCode.length}
          onClick={this.submitAddress}
        >
          Continue
        </Button>
      </div>
    );
  }
}
export default Shipping;