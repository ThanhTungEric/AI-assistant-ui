import { createGlobalStyle } from 'styled-components';

const LoginFormGlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    height: 100vh;
  }
`;

export default LoginFormGlobalStyle;
