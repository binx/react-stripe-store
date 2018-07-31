import React, { Component } from 'react';
import styled from 'styled-components';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withRouter } from "react-router-dom";

import PageWrapper from '../ui/PageWrapper';
import ProductDetails from './ProductDetails';
import Carousel from '../ui/Carousel';
import MobileCarousel from '../ui/MobileCarousel';
import Breadcrumb from '../ui/Breadcrumb';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled.div`
  padding: 40px;
  @media (max-width: 650px) {
    padding: 20px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 40px;
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 40px 0;
  }
`;

class Product extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: 1,
      variants: props.product.variants || []
    };
  }

  componentDidMount() {
    if (!this.props.product.stripe_id) return;

    fetch('/product-info/'+this.props.product.stripe_id)
      .then(res => res.json())
      .then(product => {
        if (product.data.length > 1) {
          const attr = Object.keys(product.data[0].attributes)[0]
          const product_skus = {
            "name": attr,
            "options": product.data.map(sku => ({
              sku_id: sku.id,
              price: sku.price/100,
              label: sku.attributes[attr]
            }))
          }
          let variants = [...this.state.variants]
          variants.push(product_skus);
          const defaultChoice = product_skus.options[0]
          this.setState({
            variants,
            sku_id: defaultChoice.sku_id,
            price: defaultChoice.price
          });
        } else {
          this.setSKU({
            sku_id: product.data[0].id,
            price: product.data[0].price/100
          });
        }
      }).catch(error => console.error('Error:', error));
  }

  setSKU = (sku) => {
    const state = Object.assign({}, this.state, sku)
    this.setState(state);
  }

  addToCart = (state) => {
    const { product, config } = this.props;
    let attr = {};

    this.state.variants.forEach(key => {
      const name = key.name;
      if (name === "quantity") return;
      if (state[name])
        attr[name] = state[name]
      else {
        const defaultChoice = this.state.variants.find(v => v.name === name).options[0].label;
        attr[name] = defaultChoice;
      }
    });

    const slug = `${config.store_slug}_products`;
    let products = JSON.parse(localStorage.getItem(slug));
    products = Array.isArray(products) ? products : [];

    const item = {
      img : `../photos/${product.url}/${product.photos[0]}`,
      url: `/product/${product.url}`,
      sku_id: this.state.sku_id,
      name: product.name,
      price: this.state.price,
      attr,
      quantity: state.quantity
    };
    products.push(item)
    localStorage.setItem(slug, JSON.stringify(products));
    this.props.updateNumber(products.length)
    this.props.history.push("/cart");
  }

  render() {
    const { product } = this.props;
    let photos;
    if (isWidthUp('sm', this.props.width)) {
      photos = <Carousel photos={product.photos} url={product.url} />;
    } else {
      photos = <MobileCarousel photos={product.photos} url={product.url} />;
    }

    return (
      <PageWrapper>
        <Paper>
          <Wrapper>
            <Breadcrumb product={product} />
            <Grid>
              {photos}
              <div style={{ gridColumn: "span 2" }}>
                <ProductDetails
                  product={product}
                  quantity={this.state.quantity}
                  variants={this.state.variants}
                  price={this.state.price}
                  setSKU={this.setSKU}
                  addToCart={this.addToCart}
                />
              </div>
            </Grid>
          </Wrapper>
        </Paper>
      </PageWrapper>
    );
  }
};
export default withWidth()(withRouter(Product));