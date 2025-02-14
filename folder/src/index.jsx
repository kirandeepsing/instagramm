import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../src/input.css"
import { Provider } from 'react-redux';
import {store} from "./redux/store.jsx";
import "../src/output.css"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
</Provider>,
)
