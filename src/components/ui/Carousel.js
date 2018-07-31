import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  grid-column: span 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;
const IMG = styled.div`
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 75%;
  padding-bottom: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  margin-bottom: 10px;
  background-position: 50%;
  cursor: pointer;
`;
const LargeIMG = styled.div`
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 100%;
  padding-bottom: 133%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 0;
  display: inline-block;
  grid-column: span 3;
`;

class Carousel extends Component {
  state = {
    img: this.props.photos[0]
  };
  
  pickImage = (img) => {
    this.setState({ img })
  }
  
  render() {
    const { photos, url } = this.props;
    return (
      <Wrapper>
        <div>
          {photos.map((p,i) => {
            return <IMG
              onClick={() => this.pickImage(p)}
              img={`../photos/${url}/${p}`} key={i}
            />
          })}
        </div>
        <LargeIMG img={`../photos/${url}/${this.state.img}`} />
      </Wrapper>
    );
  }
};
export default Carousel;