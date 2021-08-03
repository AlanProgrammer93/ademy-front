import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from './context';


ReactDOM.render(
  <Provider>
      <ToastContainer position="top-center" />
      <App />
  </Provider>,
  document.getElementById('root')
);

