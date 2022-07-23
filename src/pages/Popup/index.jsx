import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import '../../assets/styles/tailwind.css';

// MobX validation
if (!new class { x }().hasOwnProperty('x')) throw new Error('Transpiler is not configured correctly');

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();

let injected = {};

async function injectContentScript() {
    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab?.id) {
        if (injected[tab.id]) return;
        
        if (tab.url.startsWith("https://garticphone.com")) {
            injected[tab.id] = true;
            
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['contentScript.bundle.js']
            });
        }
    }
}

injectContentScript();