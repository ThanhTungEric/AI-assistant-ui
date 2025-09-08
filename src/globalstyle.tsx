import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
  }
`;

export const LoginFormGlobalStyle = createGlobalStyle`
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

