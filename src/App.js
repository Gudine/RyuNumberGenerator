import { useRef, useState } from 'react';
import styled from 'styled-components';
import BottomRow from './components/BottomRow';
import CircleBtns from './components/CircleBtns';
import Entry from './components/Entry';
import TopRow from './components/TopRow';
import RyuImg from './images/ryu.png';
import RyuNameImg from './images/ryuname.png';

const RyuName = styled.div`
  width: 208px;
  height: 66px;
  grid-row: 1;
  grid-column: -2;
  background-image: url(${RyuNameImg});
  align-self: end;
`;

const RyuCircle = styled.div`
  grid-row: 2;
  grid-column: -2;
  background: url(${RyuImg}) center / 100% 100%;
  width: 192px;
  height:192px;
  border:8px solid black;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0px 0px 10px black;
  background-color: white;
`;

const MiddleRow = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-flow: column;
  place-items: center;
  overflow-x: scroll;
`;

const CircleContainer = styled.div`
  display: grid;
  grid-auto-columns: 52px 52px 208px;
  grid-template-rows: 208px 208px 208px;
  grid-auto-flow: column;
  place-items: center;
  padding-right: 52px;
  background-color: white;
  justify-self: start;
`;

function App() {
  const [circles, setCircles] = useState(1);
  const containerRef = useRef(null);

  const addCircle = () => {
    if (circles < 10) setCircles(circles + 1);
  };

  const removeCircle = () => {
    if (circles > 1) setCircles(circles - 1);
  };

  return (
    <>
      <TopRow />

      <MiddleRow>
        <CircleBtns
          addCircle={ addCircle }
          removeCircle={ removeCircle }
        />
        <CircleContainer ref={ containerRef }>
          <RyuName />
          <RyuCircle />
          { Array(circles).fill(null).map((_,i) => (
            <Entry key={ i } index={ i }/>
          ))}
        </CircleContainer>
      </MiddleRow>

      <BottomRow area={ containerRef }/>
    </>
  );
}

export default App;
