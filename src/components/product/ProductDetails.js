import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

const FlexWrapper = styled.div `
  margin: 20px 0 40px;
`;
const Row = styled.div `
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
const Right = styled.div `
  display: flex;
  flex-direction: row-reverse;
  margin: 30px 0 60px;
  align-items: baseline;
`;
const Description = styled.div `
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
`;
const Details = styled.div `
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

function ProductDetails(props) {
  const [product, setProduct] = useState(props.product);

  const { variants } = props;

  const handleChange = name => event => {
    const newProduct = Object.assign({ ...product }, {
      [name]: event.target.value
    });
    setProduct(newProduct)

    const index = event.target.selectedIndex;
    const selectedOption = event.target.childNodes[index]
    const sku_id = selectedOption.getAttribute('sku_id');
    const price = selectedOption.getAttribute('price');
    if (sku_id)
      props.updateSkuPrice(sku_id, price);
  }

  return (
    <div>
        <h2 style={{ marginTop: "0" }}>{product.name}</h2>
        <Description>{product.description}</Description>
        { !!variants.length &&
          <FlexWrapper>
            {variants.map((variant,i) => {
              return <Row key={i}>
                <label>{variant.name.replace("_"," ")}</label>
                <Select
                  native
                  value={product[variant.name]}
                  onChange={handleChange(variant.name)}
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
          ${props.price}
        </div>
        <Right>
          <Button variant="contained" color="primary"
            onClick={() => props.addToCart(product)}
          >
            Add To Cart
          </Button>
          <TextField
            value={props.quantity}
            onChange={e => props.setQuantity(e.target.value)}
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
};
export default ProductDetails;