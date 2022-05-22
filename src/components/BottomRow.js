import styled from 'styled-components';
import domtoimage from 'dom-to-image';
import { useState } from 'react';

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-self: start;
`;

const PrintBtn = styled.button`
  width: 50vw;
  background-color: #dfdfdf;
  font-family: "Arial", sans-serif;
  font-weight: 900;
  font-size: 24pt;
`;

const PrintImg = styled.img`
  max-width: 80%;
`;

const BottomRow = ({ area }) => {
  const [image, setImage] = useState('');

  const printScreen = (ev) => {
    ev.preventDefault();
    
    domtoimage.toPng(area.current)
      .then((dataUrl) => setImage(dataUrl))
      .catch((error) => console.error('oops, something went wrong!', error));
  }

  return (
    <Main>
      <PrintBtn type="button" onClick={ printScreen }>Print!</PrintBtn>
      { image && <PrintImg src={ image } alt="Ryu Number" /> }
    </Main>
  );
};

export default BottomRow;
