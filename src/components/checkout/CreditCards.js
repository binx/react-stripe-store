import React, { Component } from 'react';
import {
  CardElement,
  Elements,
  injectStripe
} from 'react-stripe-elements';

import Button from '@material-ui/core/Button';

const createOptions = (fontSize) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#222',
        letterSpacing: '0.025em',
        fontFamily: 'Raleway, sans-serif',
        fontWeight: '100',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class _CardForm extends Component {
  state = { disabled: false };
  handleSubmit = ev => {
    ev.preventDefault();
    this.props.stripe.createToken()
      .then(payload => {
        this.setState({ disabled: true })
        this.props.setToken(payload.token.id)
      });
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <CardElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <Button variant="raised" color="primary" 
          disabled={this.state.disabled} onClick={this.handleSubmit}
        >
          Complete Order
        </Button>
      </form>
    );
  }
}
const CardForm = injectStripe(_CardForm);

class CreditCard extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
    };
    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

  render() {
    const {elementFontSize} = this.state;
    return (
      <div className="Checkout">
        <Elements>
          <CardForm fontSize={elementFontSize} setToken={this.props.setToken} />
        </Elements>
      </div>
    );
  }
}
export default CreditCard;