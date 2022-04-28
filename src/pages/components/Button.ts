import styled from '@emotion/styled'

const Button = styled.button`
    font-weight: 600;
    padding: 1em 2em;
    min-width: 120px;
    background-color: ${(props: {transparent?: boolean | null}) => props.transparent ? "transparent" : "#328dd2"};
    color: ${(props: {transparent?: boolean | null}) => props.transparent ? "#328dd2" :  "inherit"};
    text-transform: uppercase;
    border: 3px solid #328dd2;
    border-radius: 0.5em;
    transition: 200ms;
    cursor: pointer;
    :hover {
        border-color: ${(props: {transparent?: boolean | null}) => props.transparent ? "#328dd2" : "#2672ab"};
        background-color: ${(props: {transparent?: boolean | null}) => props.transparent ?"#328dd2" : "#2672ab"};
        color: white;
    }
`;

export default Button;