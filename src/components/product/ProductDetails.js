import React, { Component } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

const FlexWrapper = styled.div`
  margin: 20px 0 40px;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  > label {
    line-height: 34px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
    text-transform: capitalize;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin: 30px 0 60px;
  align-items: baseline;
`;
const Description = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
`;
const Details = styled.div`
  clear: both;
  font-size: 14px;
  margin-top: 20px;
  > ul {
    margin: 0;
    padding: 0 20px 0;
    > li {
      margin-bottom: 10px;
    }
  }
`;

class ProductDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: this.props.quantity
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    const index = event.target.selectedIndex;
    const selectedOption = event.target.childNodes[index]
    const sku_id =  selectedOption.getAttribute('sku_id');
    const price =  selectedOption.getAttribute('price');
    if (sku_id) this.props.setSKU({ sku_id, price })
  }
  render() {
    const { product } = this.props;
    return (
      <div>
        <h2 style={{ marginTop: "0" }}>{product.name}</h2>
        <Description>{product.description}</Description>
        { this.props.variants &&
          <FlexWrapper>
            {this.props.variants.map((variant,i) => {
              return <Row key={i}>
                <label>{variant.name.replace("_"," ")}</label>
                <Select
                  native
                  value={this.state[variant.name]}
                  onChange={this.handleChange(variant.name)}
                  style={{ width: "155px", fontSize: "14px", height: "29px" }}
                >
                  { variant.options.map((option,j) => {
                    if (isNaN(option.label)) {
                      option.label = option.label.charAt(0).toUpperCase() + option.label.slice(1);
                    }
                    return <option key={j} value={option.label}
                      sku_id={option.sku_id} price={option.price}
                    >{option.label}</option>
                  })}
                </Select>
              </Row>
            })}
          </FlexWrapper>
        }
        <div style={{ fontWeight: "600", textAlign: "right" }}>
          ${this.props.price}
        </div>
        <Right>
          <Button variant="raised" color="primary"
            onClick={() => this.props.addToCart(this.state)}
          >
            Add To Cart
          </Button>
          <TextField
            value={this.state.quantity}
            onChange={this.handleChange('quantity')}
            type="number"
            margin="normal"
            style={{ width: "40px", margin: "0 30px 0" }}
          />
        </Right>
        { product.details &&
          <Details>
            <ul>
              {product.details.map((detail,i) =>
                <li key={i}>{detail}</li>
              )}
            </ul>
          </Details>
        }
      </div>
    );
  }
};
export default ProductDetails;