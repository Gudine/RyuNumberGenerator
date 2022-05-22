import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import numbers from '../images';
import blackImg from '../images/black.png';
import intersectionImg from '../images/intersection.png';
import stretchImg from '../images/stretch.png';
import CropperCont from './CropperCont';

const circleDragOver = keyframes`
  from { background-size: 5% 100%, 50% 100%, 50% 100%; }
  to { background-size: 33% 100%, 50% 100%, 50% 100%; }
`;

const circleDragLeave = keyframes`
  from { background-size: 33% 100%, 50% 100%, 50% 100%; }
  to { background-size: 5% 100%, 50% 100%, 50% 100%; }
`;

const circleDragOverSingle = keyframes`
  from { background-size: 0% 100%, 100% 100%; }
  to { background-size: 33% 100%, 100% 100%; }
`;

const circleDragLeaveSingle = keyframes`
  from { background-size: 33% 100%, 100% 100%; }
  to { background-size: 0% 100%, 100% 100%; }
`;

const Intersection = styled.div`
  grid-row: 2;
  grid-column-end: span 2;
  background-image: url(${intersectionImg});
  width: 134px;
  height: 100%;
  position: relative;
  left: -1px;
`;

const IntersectionNumber = styled.div`
  position:relative;
  left: 24px;
  top: 57px;
  width:36px;
  height:38px;
`;

const Stretch = styled.div`
  align-self: start;
  grid-row: 3;
  grid-column-end: span 2;
  background-image: url(${stretchImg});
  width: 9px;
  height: 83px;
  position: relative;
  left: -1px;
`;

const Game = styled.div`
  align-self: start;
  margin-top: 31px;
  grid-row: 3;
  grid-column-end: span 4;
  font-family: "Arial", sans-serif;
  font-size: 24pt;
  text-align: center;
  max-width: 100%;

  ${p => p.lower && `margin-top: 105px;`}
`;

const Name = styled.div`
  align-self: end;
  margin-bottom: 20px;
  grid-row: 1;
  grid-column-end: span 3;
  font-family: "Arial", sans-serif;
  font-weight: 900;
  font-size: 24pt;
  text-align: center;
  max-width: 100%;
`;

const Circle = styled.div.attrs(p => ({ style: {
  gridColumn: `${p.gridStart} / auto`,
  background: p.type === 'single'
    ? `url(${blackImg}) center / ${p.dragStatus === 'dragOver' ? '33%' : '0%'} 100% no-repeat,
      url("${p.leftImg || p.rightImg}") center / 100% 100%`
    : `url(${blackImg}) center / ${p.dragStatus === 'dragOver' ? '33%' : '5%'} 100% no-repeat,
      url("${p.leftImg}") left / 50% 100% no-repeat,
      url("${p.rightImg}") right / 50% 100% no-repeat`,
}}))`
  grid-row: 2;
  width: 192px;
  height:192px;
  border:8px solid black;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 0px 10px black;
  background-color: white;

  ${p => p.type === 'single' ? css`
    background-size: 0% 100%, 100% 100%;
    background-position: center;

    ${ p.dragStatus === 'dragOver' && css`
      animation: ${circleDragOverSingle} 200ms ease-out 0s 1;
      background-size: 33% 100%, 100% 100%;`}

    ${ p.dragStatus === 'dragLeave' && css`
      animation: ${circleDragLeaveSingle} 200ms ease-out 0s 1;`}
  ` : css`
    ${ p.dragStatus === 'dragOver' && css`
      animation: ${circleDragOver} 200ms ease-out 0s 1;
      background-size: 33% 100%, 50% 100%, 50% 100%;`}

    ${ p.dragStatus === 'dragLeave' && css`
      animation: ${circleDragLeave} 200ms ease-out 0s 1;`}
  `}
`;

const Entry = ({ index }) => {
  const [imageType, setImageType] = useState('split');
  const [leftImage, setLeftImage] = useState('');
  const [rightImage, setRightImage] = useState('');
  const [dragStatus, setDragStatus] = useState(null);
  const [dragTimeout, setDragTimeout] = useState(null);
  const [cropperData, setCropperData] = useState(null);

  useEffect(() => {
    if (dragStatus === 'dragLeave') {
      setDragTimeout(setTimeout(() => {
        setDragStatus(null);
        setDragTimeout(null);
      }, 300));
    }
  }, [dragStatus]);

  const dragOverHandler = (ev) => {
    ev.preventDefault();
    setDragStatus('dragOver');
    clearTimeout(dragTimeout);
    setDragTimeout(null);
  }

  const dragLeaveHandler = (ev) => {
    ev.preventDefault();
    setDragStatus('dragLeave');
  }
  
  const dropHandler = (ev) => {
    ev.preventDefault();
    setDragStatus('dragLeave');
    
    //Check on which part of the circle the file was dragged into
    let side = 'center';
    if (ev.nativeEvent.offsetX < ev.target.clientWidth/3) side = 'left'
    else if (ev.nativeEvent.offsetX > ((ev.target.clientWidth/3)*2)) side = 'right';

    let file;
    if (ev.dataTransfer.items) {
      if (ev.dataTransfer.items[0].kind === 'file') {
        file = ev.dataTransfer.items[0].getAsFile();
      }
    } else {
      file = ev.dataTransfer.files[0];
    }
    if (file) {
      file = URL.createObjectURL(file);
      setCropperData({file, side});
    }
  }

  const handleNewImage = (image, side) => {
    setCropperData(null);
    if (side === 'left') {
      setImageType('split');
      setLeftImage(image);
    } else if (side === 'right') {
      console.log(imageType);
      if (imageType === 'single') setLeftImage(null);
      setImageType('split');
      setRightImage(image);
    } else {
      setImageType('single');
      setLeftImage(image);
      setRightImage(null);
    }
  };

  const textReset = ({ target }, defaultText) => {
    if (target.textContent.match(/^\s*$/)) target.textContent = defaultText;
  }

  const contentNoStyle = (ev) => {
    ev.preventDefault();
    let text = ev.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text)
  };

  return (
    <>
      { !!cropperData && (
        <CropperCont
          file={ cropperData.file }
          side={ cropperData.side }
          handleNewImage={ handleNewImage }
        />
      ) }
      <Intersection
        style={{ gridColumnStart: -4 - (index * 3) }}
      >
        <IntersectionNumber
          style={{ backgroundImage: `url(${numbers[index]})` }}
        />
      </Intersection>
      { !!(index%2) && (<Stretch
        style={{ gridColumnStart: -4 - (index * 3) }}
      />) }
      <Game
        lower={ !!(index%2) }
        style={{ gridColumnStart: -5 - (index * 3) }}
        spellCheck="false"
        contentEditable="true"
        onBlur={ (ev) => textReset(ev, 'Game') }
        onPaste={ contentNoStyle }
        suppressContentEditableWarning
      >
        Game
      </Game>
      <Name
        style={{ gridColumnStart: -6 - (index * 3) }}
        spellCheck="false"
        contentEditable="true"
        onBlur={ (ev) => textReset(ev, 'Name') }
        onPaste={ contentNoStyle }
        suppressContentEditableWarning
      >
        Name
      </Name>
      <Circle
        gridStart={ -5 - (index * 3) }
        type={ imageType }
        leftImg={ leftImage }
        rightImg={ rightImage }
        dragStatus={ dragStatus }
        onDragOver={ dragOverHandler }
        onDragLeave={ dragLeaveHandler }
        onDrop={ dropHandler }
      />
    </>
  );
};

export default Entry;
