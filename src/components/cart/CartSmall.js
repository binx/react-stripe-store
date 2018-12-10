import React, { Component } from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const Wrapper = styled.div`
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  text-transform: capitalize;
  font-size: 16px;
  .full {
    flex: 1;
    margin-left: 10px;
  }
  > span {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .black-text { color: #000; }
  .small-text { font-size: 14px; }
`;
const Image = styled.div`
  background-image: url(${props => props.img});
  width: 62px;
  height: 62px;
  background-size: cover;
  background-position: 50%;
`;

class CartSmall extends Component {
  render() {
    let price;
    if (this.props.items.length) {
      price = this.props.items
        .map(i => i.quantity*i.price)
        .reduce((a,b) => a+Number(b))
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }
    return (
      <Wrapper>
        { this.props.items.map((d,i) => {
          let attrs = [];
          for (let key in d.attr) {
            attrs.push(`${key.replace("_", " ")}: ${d.attr[key]}`)
          }
          attrs = attrs.join(", ");

          return (<Row key={`cart${i}`}>
            <span>
              <Image img={d.img} />
            </span>
            <span className="full">
              <Row>
                <span className="black-text">{d.name}</span>
                <span>{d.quantity}</span>
              </Row>
              <div className="small-text">{attrs}</div>
            </span>
          </Row>);
        })}
        <Divider style={{ margin: "20px 0" }}/>
          <Row>
            <span className="small-text">Subtotal</span>
            <span className="black-text small-text">{price}</span>
          </Row>
          <Row>
            <span className="small-text">Shipping</span>
            <span className="black-text small-text">FREE</span>
          </Row>
        <Divider style={{ margin: "20px 0" }}/>
          <Row>
            <span>Total</span>
            <span className="black-text">{price}</span>
          </Row>
      </Wrapper>
    );
  }
};
export default CartSmall;