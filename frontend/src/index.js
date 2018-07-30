import React from 'react';
import ReactDOM from 'react-dom';
// import './semantic/semantic.min.css';
import '5sigma-ui/5sigma.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
