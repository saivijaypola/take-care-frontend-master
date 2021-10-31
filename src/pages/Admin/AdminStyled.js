import {
    Container, Row, Col, Button, Modal, Spinner, ModalBody
} from "reactstrap";
import styled from "styled-components";


const RequestContentWrapper = styled(Row)`
margin-top:30px;
`;
const SearchWrapper = styled(Row)`
display:flex;
align-items:center;
h6{
    margin-top:5px;
}

`;

const QuoteHeading = styled.h5`
 font-size: 18px !important;
 font-weight:bold !important;
span{
    color: gray;
    font-weight:normal!important;
}`;

const FormRow = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin:10px;
    align-items: flex-start;
`;

const FormRowHorizontal = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin:10px;
    h5{
        margin:0 5px;
        font-weight:bold;
        font-size:18px;
        width: 250px;
    }
    input{
        height: 40px;
    padding: 0 10px;
    border: solid 1px #d9dce2;
    width: 250px;
    margin:0 5px;
    }
    select{
        height: 40px;
    padding: 0 10px;
    border: solid 1px #d9dce2;
    margin-right: 5px;
    }
`;

const PaginationWrapper = styled.div`
    width: 100%;
    margin: 55px 0;
    display: flex;
    justify-content: center;
    .pagination li a{
        font-size: 19px;
        padding:10px
    }
`;

export {
    RequestContentWrapper,
    SearchWrapper,
    QuoteHeading,
    FormRow,
    PaginationWrapper,
    FormRowHorizontal
}