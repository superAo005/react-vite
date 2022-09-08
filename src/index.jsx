import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { BrowserRouter /* , HashRouter */ } from 'react-router-dom';


// App
import './app.less';
import App from './app';

// 挂载
ReactDOM.createRoot(document.getElementById('app')).render(
  <BrowserRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>,
);