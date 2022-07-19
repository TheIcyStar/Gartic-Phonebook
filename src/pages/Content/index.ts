import { PlayerData } from "../Popup/players.store";

let players: PlayerData[] = [];
chrome.storage.local.get("players", (result) => {
    if (result.players) {
        players = result.players;
    }
});
chrome.storage.onChanged.addListener(function(changes) {
    if(changes.players){
        players = changes.players.newValue;
    }
});

function findFirstChildByTagName(parent: HTMLElement, tagName: string): HTMLElement | undefined{
    for(const child of parent.children as HTMLCollectionOf<HTMLElement>){
        if(child.tagName === tagName){
            return child
        }
    }
}

type AvatarElements = {
    avatarElement: HTMLElement,
    usernameElement: HTMLElement,
    username: string
}

function getAvatarElementsFromMain(): AvatarElements[]{
    let user = Array.from(document.getElementsByClassName("user") as HTMLCollectionOf<HTMLElement>)[0]
    let dataTab = Array.from(user.getElementsByClassName("data") as HTMLCollectionOf<HTMLElement>)[0]

    //get avatar span element
    let avatarHolder = Array.from(dataTab.getElementsByClassName("avatar") as HTMLCollectionOf<HTMLElement>)[0]
    let avatar = findFirstChildByTagName(avatarHolder, "SPAN")

    //get username input box
    let usernameInputHolder = findFirstChildByTagName(dataTab.children[0] as HTMLElement, "SPAN")
    if(!usernameInputHolder) return [];
    let usernameInput = findFirstChildByTagName(usernameInputHolder, "INPUT") as HTMLInputElement

    //Check that everything exists
    if(!avatar || !usernameInput) return [];

    return [{avatarElement: avatar, usernameElement: usernameInput, username: usernameInput.value}]
}


function getAvatarElementsFromLobby(): AvatarElements[]{
    let AvatarElementsList: AvatarElements[] = []
    let userElements = Array.from(document.getElementsByClassName("user") as HTMLCollectionOf<HTMLElement>)

    for(const user of userElements){
        if(user.classList.contains("empty") || user.classList.contains("guest")) continue;

        //get avatar span element
        let avatarHolder = Array.from(user.getElementsByClassName("avatar") as HTMLCollectionOf<HTMLElement>)[0]
        let avatarElement = findFirstChildByTagName(avatarHolder, "SPAN")

        //get username p element
        let usernameElement = Array.from(user.getElementsByClassName("nick") as HTMLCollectionOf<HTMLElement>)[0]

        //Check that everything exists
        if(!avatarElement || !usernameElement) continue;

        AvatarElementsList.push({avatarElement: avatarElement, usernameElement: usernameElement, username: usernameElement.innerText})
    }

    return AvatarElementsList
}

//This function also uses functionality from getAvatarElementsFromLobby(), as the method for getting from the player list is identical to the lobby's
function getAvatarElementsFromBook(): AvatarElements[]{
    let AvatarElementsList: AvatarElements[] = []
    let drawingElements = Array.from(document.getElementsByClassName("drawing") as HTMLCollectionOf<HTMLElement>)
    let answerElements = Array.from(document.getElementsByClassName("answer") as HTMLCollectionOf<HTMLElement>)
    let balloons = [...drawingElements, ...answerElements]

    for(const balloon of balloons){
        //get avatar span element
        let avatarHolder = Array.from(balloon.getElementsByClassName("avatar") as HTMLCollectionOf<HTMLElement>)[0]
        let avatarElement = findFirstChildByTagName(avatarHolder, "SPAN")

        let usernameElement: HTMLElement | undefined
        const nickElements = balloon.getElementsByClassName('nick');
        if(nickElements.length > 0){
            usernameElement = nickElements[0] as HTMLElement;
        } else {
            //get username span element, by finding the span that has an sibling div with a ".balloon" class
            //this would have been SO much easier if the div.answerBalloon.answer used spans that had the nick class just how div.drawBalloon.drawing does 😔
            for(const child of balloon.children as HTMLCollectionOf<HTMLElement>){
                const currChildren = Array.from(child.children as HTMLCollectionOf<HTMLElement>);
                if(currChildren.some(child => child.classList.contains("balloon"))) {
                    usernameElement = currChildren.find(child => child.tagName === "SPAN") as HTMLElement;
                }
                if(usernameElement) break;
            }
        }

        //Check that everything exists
        if(!avatarElement || !usernameElement) continue;

        AvatarElementsList.push({avatarElement: avatarElement, usernameElement: usernameElement, username: usernameElement.innerText})
    }

    let playerListElements = getAvatarElementsFromLobby() //Re-use the lobby's getter code because the player list is identical
    return [...AvatarElementsList, ...playerListElements]
}

function findAvatarElements(): AvatarElements[]{
    let location = document.location.pathname;

    if(location === "/"){
        return getAvatarElementsFromMain()
    } else if(location === "/lobby"){
        return getAvatarElementsFromLobby()
    } else if(location === "/book"){
        return getAvatarElementsFromBook()
    }

    return []
}

function sweepAvatars(){
    let avatarElements = findAvatarElements();

    for(const avatar of avatarElements){
        let targetModData = players.find(p => p.username.toLowerCase() === avatar.username.toLowerCase())
        if(!targetModData) {
            avatar.avatarElement.style.backgroundImage = '';
            return;
        }

        avatar.avatarElement.style.backgroundImage = `url(${targetModData.imageURL})`
        avatar.avatarElement.style.borderRadius = "50%"
    }
}

setInterval(sweepAvatars, 1000)