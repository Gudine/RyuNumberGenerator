import { useState } from 'react';
import styled from 'styled-components';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0, 0.5);
  
  display:flex;
  justify-content:center;
  align-items:center;
`;

const Container = styled.div`
  width: calc(calc(50vw + 50vh) / 2.25);
  height: calc(calc(50vw + 50vh) / 2.25);
  background-color: white;
  
  display:flex;
  justify-content:space-evenly;
  align-items:center;
  flex-direction: column;
  border-radius: 10%;
`;

const Heading = styled.h2`
  font-family: 'Arial', sans-serif;
  font-size: 20pt;
  text-align: center;
`;

const ImgCont = styled.div`
  width: calc(calc(50vw + 50vh) / 3.25);
  height: calc(calc(50vw + 50vh) / 3.25);

  .cropper-view-box, .cropper-face {
    ${p => p.side === 'left' && `
      border-radius: 100% 0 0 100%/50% 0 0 50%;
    `}
    ${p => p.side === 'center' && `
      border-radius: 50%;
    `}
    ${p => p.side === 'right' && `
      border-radius: 0 100% 100% 0/0 50% 50% 0;
    `}
  }
`;

const Image = styled(Cropper)`
  max-width: 100%;
  max-height: 100%;
`;

const CropBtn = styled.button`
  width: calc(calc(50vw + 50vh) / 3.25);
  font-family: 'Arial', sans-serif;
  font-size: 20pt;
  text-align: center;
`;


const CropperCont = ({ file, side, handleNewImage }) => {
  const [isReady, setReady] = useState(false);
  const [cropper, setCropper] = useState(null);

  const handleSubmit = (ev) => {
    console.log(side);
    let result = cropper.getCroppedCanvas();
    cropper.destroy();
    result.toBlob((canvas) => handleNewImage(URL.createObjectURL(canvas), side));
  }

  return (
    <Wrapper>
      <Container>
        <Heading>
          Select the area of the
          <br />
          image you want to use
        </Heading>
        <ImgCont side={ side }>
          <Image
            src={ file }
            alt=""
            aspectRatio={ side === 'center' ? 1/1 : 1/2 }
            viewMode={ 1 }
            dragMode="move"
            guides={ false }
            autoCropArea={ 1 }
            wheelZoomRatio={ 0.2 }
            toggleDragModeOnDblclick={ false }
            onInitialized={ c => setCropper(c) }
            ready={ () => setReady(true) }
          />
        </ImgCont>
        <CropBtn
          type="button"
          disabled={ !isReady }
          onClick={ handleSubmit }
        >
          Crop
        </CropBtn>
      </Container>
    </Wrapper>
  );
};

export default CropperCont;
