import styled from 'styled-components';

const Main = styled.div`
  width: 150px;
  height: 200px;
  background-color: white;
  border:8px solid black;
  border-radius: 20%;

  display: flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  font-family: "Arial Black";
  font-size: 50pt;
  justify-self: end;
`;

const AddBtn = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content:center;
  align-items:center;
  border-bottom: 5px solid black;
`;

const RemoveBtn = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content:center;
  align-items:center;
  border-top: 5px solid black;
`;

const CircleBtns = ({ addCircle, removeCircle }) => (
  <Main>
    <AddBtn onClick={ addCircle }>+</AddBtn>
    <RemoveBtn onClick={ removeCircle }>-</RemoveBtn>
  </Main>
);

export default CircleBtns;






