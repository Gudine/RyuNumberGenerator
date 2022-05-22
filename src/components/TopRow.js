import styled from 'styled-components';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
`;

const Title = styled.h1`
  font-family: "Arial", sans-serif;
  font-weight: 900;
  font-size: 40pt;
  text-align: center;
  margin: 0px;
`;

const Subtitle = styled.p`
  font-family: "Arial", sans-serif;
  font-weight: 900;
  font-size: 20pt;
  font-weight: 700;
  text-align: center;
  margin: 0px;
`;

const TopRow = () => (
  <Main>
    <Title>Ryu Number Generator</Title>
    <Subtitle>Drag images into the circles to add them in</Subtitle>
  </Main>
);

export default TopRow;