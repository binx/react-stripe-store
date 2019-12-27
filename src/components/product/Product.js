import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withRouter } from "react-router-dom";

import PageWrapper from '../ui/PageWrapper';
import ProductDetails from './ProductDetails';
import Carousel from '../ui/Carousel';
import MobileCarousel from '../ui/MobileCarousel';
import Breadcrumb from '../ui/Breadcrumb';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled.div `
  padding: 40px;
  @media (max-width: 650px) {
    padding: 20px;
  }
`;
const Grid = styled.div `
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 40px;
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 40px 0;
  }
`;

function Product(props) {
  const initialVariants = props.product.variants ? [props.product.variants] : [];
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState(initialVariants);
  const [sku_id, setSkuID] = useState();
  const [price, setPrice] = useState();

  const { product, config } = props;

  useEffect(() => {
    if (!props.product.stripe_id) return;

    fetch(`/product-info/${props.product.stripe_id}`)
      .then(res => res.json())
      .then(product => {
        if (product.data && product.data.length > 1) {
          const attr = Object.keys(product.data[0].attributes)[0]
          const product_skus = {
            "name": attr,
            "options": product.data.map(sku => ({
              sku_id: sku.id,
              price: sku.price / 100,
              label: sku.attributes[attr]
            }))
          }
          let newVariants = [...variants];
          newVariants.unshift(product_skus);
          setVariants(variants);

          const defaultChoice = product_skus.options[0];
          setSkuID(defaultChoice.sku_id);
          setPrice(defaultChoice.price);

        } else {
          setSkuID(product.data[0].id);
          setPrice(product.data[0].price / 100);
        }
      }).catch(error => console.error('Error:', error));

  }, []);

  const updateSkuPrice = (newSkuID, newPrice) => {
    setSkuID(newSkuID);
    setPrice(newPrice)
  }

  const addToCart = order => {

    let attr = {};
    variants.forEach(key => {
      const name = key.name;
      if (order[name])
        attr[name] = order[name]
      else {
        const defaultChoice = variants.find(v => v.name === name).options[0].label;
        attr[name] = defaultChoice;
      }
    });

    const slug = `${config.store_slug}_products`;
    let products = JSON.parse(localStorage.getItem(slug));
    products = Array.isArray(products) ? products : [];

    const item = {
      img: `../photos/${product.url}/${product.photos[0]}`,
      url: `/product/${product.url}`,
      sku_id: sku_id,
      name: product.name,
      price: price,
      attr,
      quantity: quantity
    };
    products.push(item)
    localStorage.setItem(slug, JSON.stringify(products));
    props.updateNumber(products.length)
    props.history.push("/cart");
  }

  let photos;
  if (isWidthUp('sm', props.width)) {
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
                quantity={quantity}
                setQuantity={setQuantity}
                variants={variants}
                price={price}
                updateSkuPrice={updateSkuPrice}
                addToCart={addToCart}
              />
            </div>
          </Grid>
        </Wrapper>
      </Paper>
    </PageWrapper>
  );
};
export default withWidth()(withRouter(Product));