import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import '../../assets/styles/tailwind.css';

// MobX validation
if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
