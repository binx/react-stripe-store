import React from 'react';
import styled from 'styled-components';

import PageWrapper from './ui/PageWrapper';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ProductList from './product/ProductList';

const Hero = styled.div `
  height: 300px;
  background: #aaa;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -40px -40px 60px;
  position: relative;
`;

const CallOut = styled.div `
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #f1f1f1;
  width: 100%;
  padding: 20px;
`;

const Landing = ({ config }) => (
  <PageWrapper>
    <Paper style={{ padding: "40px" }}>
      <Hero>
      <video autoPlay muted loop style={{ position: "absolute", height: "300px", width: "100%", objectFit: "cover"}} id="myVideo">
            <source src="../videos/robo-cards-low.mp4"></source>
          </video>
        <CallOut>Dreamed and Drawn by a Robot</CallOut>

      </Hero>
      <Divider style={{ margin: "40px 0" }}/>
      <ProductList config={config} />
    </Paper>
  </PageWrapper>
);

export default Landing;