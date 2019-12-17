import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';

const Wrapper = styled.div `
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 40px;
  > a {
    text-decoration: none;
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px;
  }
`;
const LargeIMG = styled.div `
  background-image: url(${props => props.img});
  background-color: #ddd;
  width: 100%;
  padding-bottom: 133%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
  @media (min-width: 650px) {
    filter: grayscale(100%);
    transition: filter .5s;
    &:hover {
      filter: grayscale(0);
    }
  }
`;
const ImgWrapper = styled.div `
  border-bottom: 3px solid ${props => props.borderColor};
  display: flex;
`;
const Title = styled.div `
  color: black;
  text-decoration-color: #FF7400;
  margin-top: 10px;
  @media (max-width: 650px) {
    font-size: 14px;
  }
`;
const Price = styled.span `
  display: block;
  color: #888;
  font-size: 14px;
  margin-top: 5px;
`;

function ProductList(props) {
  const [products, setProducts] = useState(props.config.products);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    fetch('/product-info/')
      .then(res => res.json())
      .then(skus => {
        let newProducts = [...products]
        newProducts.forEach(product => {
          let skuList = [...skus]
          skuList = skuList.filter(s => s.product === product.stripe_id)
            .map(s => s.price / 100)
          if (skuList.length === 1) {
            product["price"] = skuList[0];
          } else {
            let min = Math.min(...skuList),
              max = Math.max(...skuList);
            if (min === max) product["price"] = skuList[0];
            else product["price"] = `${min} - $${max}`;
          }
        })
        setProducts(newProducts)
      }).catch(error => console.error('Error:', error))
  }

  return (
    <Wrapper>
      { products.map((product,i) => {
        return <Link key={i} to={`/product/${product.url}`}>
          <ImgWrapper borderColor={props.theme.palette.secondary.main}>
            <LargeIMG img={`../photos/${product.url}/${product.photos[0]}`}/>
          </ImgWrapper>
          <Title>
            {product.name}
            <Price>${product.price}</Price>
          </Title>
        </Link>
      })}
    </Wrapper>
  );
};
export default withTheme(ProductList);