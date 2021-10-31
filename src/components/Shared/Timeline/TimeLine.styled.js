import styled from "styled-components";

const BillImage = styled.img`
    width: 500px;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
`;
const BillImageWrapper = styled.div`
display:flex;
background-color:'red'

`;
const ClaimAmountWrapper = styled.div`
display:flex;
margin-top: 20px;
    margin-bottom: 20px;

`;
const ModelImage = styled.img`
    width: 480px;
    height: 500px;
    margin-bottom: 10px;
    object-fit: contain;`;

export {
    BillImageWrapper,
    BillImage,
    ClaimAmountWrapper,
    ModelImage
}