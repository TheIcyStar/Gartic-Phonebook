import { PlayerData } from "../Popup/players.store";

let players: PlayerData[] = [];
chrome.storage.local.get("players", (result) => {
    if (result.players) {
        players = result.players;
        replaceAvatars();
    }
});
chrome.storage.onChanged.addListener(function(changes) {
    if(changes.players){
        players = changes.players.newValue;
        replaceAvatars();
    }
});

function findFirstChildByTagName(parent: HTMLElement, tagName: string): HTMLElement | undefined{
    for(const child of parent.children as HTMLCollectionOf<HTMLElement>){
        if(child.tagName.toLowerCase() === tagName.toLowerCase()){
            return child
        }
    }
}

type AvatarInfo = {
    avatarElement: HTMLElement,
    usernameElement?: HTMLElement,
    username: string,
    noteElement?: HTMLElement
}

function getOrCreateNote(usernameElement: HTMLElement, color: string = '#aaa') {
    let noteElement = (usernameElement.parentElement!.getElementsByClassName("note") as HTMLCollectionOf<HTMLElement>)[0];
    // Add note element if it doesn't exist as <span class="note">
    if (!noteElement) {
        noteElement = document.createElement("span");
        noteElement.classList.add("note");
        noteElement.style.cssText = `font-size: 12px; color: ${color}; font-family: 'Black';`;
        usernameElement.after(noteElement);
    }
    return noteElement;
}


let avatarInfos: AvatarInfo[] = [];

function replaceAvatars(){
    avatarInfos = avatarInfos.filter(info => info.avatarElement && document.body.contains(info.avatarElement));
    for(const avatar of avatarInfos){
        let targetModData = players.find(p => p.username.toLowerCase() === avatar.username.toLowerCase())
        if(!targetModData) {
            avatar.avatarElement.style.backgroundImage = '';
            continue;
        }

        avatar.avatarElement.style.backgroundImage = `url(${targetModData.imageURL})`
        avatar.avatarElement.style.borderRadius = "50%"
        avatar.avatarElement.style.height = 'auto';
        avatar.avatarElement.style.minHeight = '100%';

        if(avatar.noteElement) {
            avatar.noteElement.textContent = targetModData.note || '';
        }
    }
}

//setInterval(sweepAvatars, 1000)
const pageObservers: MutationObserver[] = [];

function onPageChange(changes: MutationRecord[]){
    // Find any added nodes that are DOM Elements with the class "screen"
    let newNodes = changes.filter(change => change.addedNodes.length > 0).flatMap(change => [...change.addedNodes]);
    let newScreenNodes = newNodes.filter(node => node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains("screen"));

    if (newScreenNodes.length > 0) {
        
        const newScreen = newScreenNodes.pop() as HTMLElement;
        
        pageObservers.forEach(observer => observer.disconnect());
        pageObservers.length = 0;
        handleNewScreen(newScreen);
    }
}

function handleNewScreen(newScreen: HTMLElement){
    // Check for the new screen containing the start screen
    const startScreen = newScreen.querySelector(".start");
    if (startScreen) {
        watchStartScreen(startScreen);
    }
    // Check for the new screen containing the player list
    const playerList = newScreen.querySelector(".players") as HTMLElement;
    if (playerList) {
        initPlayerList(playerList);
        const playerListObserver = new MutationObserver(onPlayerListChange);
        playerListObserver.observe(playerList, { childList: true, subtree: true });
        pageObservers.push(playerListObserver);
    }
    // Check for the new screen containing the book
    const book = newScreen.querySelector(".scrapbook") as HTMLElement;
    if (book) {
        const bookObserver = new MutationObserver(onBookChange);
        bookObserver.observe(book, { childList: true, subtree: true });
        pageObservers.push(bookObserver);
    }
}

function watchStartScreen(start: Element) {
    const userSection = start.querySelector(".user");
    const nameInput = userSection?.querySelector("input") as HTMLInputElement;
    const avatar = userSection?.querySelector(".avatar > span");
    if (nameInput && avatar) {
        const avatarElement = avatar as HTMLElement;
        function updateLobby() {
            const name = nameInput.value;
            addOrReplaceAvatarInfo({
                avatarElement: avatarElement,
                username: name
            });
            replaceAvatars();
        }
        nameInput.addEventListener("keyup", () => updateLobby());
        updateLobby();
    }
}

function initPlayerList(playerList: HTMLElement) {
    const users = [...playerList.querySelectorAll(".user")];
    for (const user of users) {
        addUserToAvatarInfos(user);
    }
    replaceAvatars();
}

function onPlayerListChange(changes: MutationRecord[]) {
    // Find any added nodes that are DOM Elements with the class "user"
    let addedNodes = changes.filter(change => change.addedNodes.length > 0).flatMap(change => [...change.addedNodes]);
    let addedUserNodes = addedNodes.filter(node => node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains("user"));
    addedUserNodes.forEach(user => addUserToAvatarInfos(user as HTMLElement));

    replaceAvatars();
}

function addUserToAvatarInfos(user: Element){
    const avatar = user.querySelector(".avatar > span");
    if (avatar) {
        const avatarElement = avatar as HTMLElement;
        const nameElement = user.querySelector(".nick") as HTMLElement;
        const noteElement = getOrCreateNote(nameElement, '#666');
        addOrReplaceAvatarInfo({
            avatarElement: avatarElement,
            username: nameElement?.innerText,
            noteElement: noteElement
        });
    }
}

function onBookChange(changes: MutationRecord[]) {
    let addedNodes = changes.filter(change => change.addedNodes.length > 0).flatMap(change => [...change.addedNodes]);
    let items = addedNodes.filter(node => node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains("item"));
    items.forEach(item => addBookItemToAvatarInfos(item as HTMLElement));
    replaceAvatars();
}

function addBookItemToAvatarInfos(item: HTMLElement) {
    let avatarElement: HTMLElement | undefined, 
        nameElement: HTMLElement | undefined, 
        noteElement: HTMLElement | undefined;
    
    const answerBalloon = item.querySelector(".answerBalloon") as HTMLElement;
    if (answerBalloon) {
        avatarElement = answerBalloon.querySelector(".avatar > span") as HTMLElement;
        const nameAndNoteContainer = findFirstChildByTagName(answerBalloon, "div");
        if (!nameAndNoteContainer) {
            return;
        }
        nameElement = findFirstChildByTagName(nameAndNoteContainer, "span") as HTMLElement;
        noteElement = getOrCreateNote(nameElement);
        addOrReplaceAvatarInfo({
            avatarElement: avatarElement,
            username: nameElement?.innerText,
            noteElement: noteElement
        });
    } else {
        const drawBalloon = item.querySelector(".drawBalloon") as HTMLElement;
        if (drawBalloon) {
            avatarElement = drawBalloon.querySelector(".avatar > span") as HTMLElement;
            nameElement = drawBalloon.querySelector(".nick") as HTMLElement;
            noteElement = getOrCreateNote(nameElement);
        }
    }
    if (avatarElement) {
        addOrReplaceAvatarInfo({
            avatarElement: avatarElement,
            username: nameElement?.innerText || '',
            noteElement: noteElement
        });
    }
}


function addOrReplaceAvatarInfo(avatarInfo: AvatarInfo) {
    const index = avatarInfos.findIndex(e => e.avatarElement === avatarInfo.avatarElement);
    if (index >= 0) {
        avatarInfos[index] = avatarInfo;
    } else {
        avatarInfos.push(avatarInfo);
    }
}

function setup() {
    console.log('setup');
    const contentEl = document.getElementById('content');
    if (!contentEl) {
        setTimeout(setup, 1000);
        return;
    }
    const observer = new MutationObserver(onPageChange);
    observer.observe(contentEl, {childList: true});

    const screenEl = document.getElementsByClassName('screen')[0] as HTMLElement;
    if (screenEl) {
        handleNewScreen(screenEl);
    }
}
setup();