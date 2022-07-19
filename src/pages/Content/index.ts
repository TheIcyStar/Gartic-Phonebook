function findFirstChildByTagName(parent: HTMLElement, tagName: string): HTMLElement | undefined{
    for(const child of parent.children as HTMLCollectionOf<HTMLElement>){
        if(child.tagName === tagName){
            return child
        }
    }
}

type AvatarElements = {
    avatarElement: HTMLElement,
    usernameElement: HTMLElement
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
    let usernameInput = findFirstChildByTagName(usernameInputHolder, "INPUT")

    //Check that everything exists
    if(!avatar || !usernameInput) return [];


    return [{avatarElement: avatar, usernameElement: usernameInput}]
}


function getAvatarElementsFromLobby(): AvatarElements[]{
    let AvatarElementsList: AvatarElements[] = []
    let userElements = Array.from(document.getElementsByClassName("user") as HTMLCollectionOf<HTMLElement>)

    for(const user of userElements){
        if(user.classList.contains("empty") || user.classList.contains("guest")) continue;

        //get avatar span element
        let avatarHolder = Array.from(user.getElementsByClassName("avatar") as HTMLCollectionOf<HTMLElement>)[0]
        let avatar = findFirstChildByTagName(avatarHolder, "SPAN")

        //get username p element
        let username = Array.from(user.getElementsByClassName("nick") as HTMLCollectionOf<HTMLElement>)[0]

        //Check that everything exists
        if(!avatar || !username) continue;

        AvatarElementsList.push({avatarElement: avatar, usernameElement: username})
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
        let avatar = findFirstChildByTagName(avatarHolder, "SPAN")

        //get username span element, by finding the span that has an sibling div with a ".balloon" class
        //this would have been SO much easier if the div.answerBalloon.answer used spans that had the nick class just how div.drawBalloon.drawing does 😔
        let username: HTMLElement | undefined
        for(const div of balloons){
            for(const child of div.children as HTMLCollectionOf<HTMLElement>){
                username = Array.from(child.children as HTMLCollectionOf<HTMLElement>).find(child => child.classList.contains("balloon"))
                if(username) break;
            }
        }

        //Check that everything exists
        if(!avatar || !username) continue;

        AvatarElementsList.push({avatarElement: avatar, usernameElement: username})
    }

    let playerListElements = getAvatarElementsFromLobby() //Re-use the lobby's getter code because the player list is identical
    return [...AvatarElementsList, ...playerListElements]
}

function findAvatarElements(): AvatarElements[]{
    let location = document.URL.substr(document.URL.lastIndexOf('/'))

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
    let avatarElements = findAvatarElements()
    console.log(avatarElements.length)

    // Change avatars using avatarElements here
    // avatar.style.backgroundImage = "url('https://static-cdn.jtvnw.net/jtv_user_pictures/fd195f6a-5b03-41d4-9e92-e8e4019fb9f8-profile_image-300x300.png')"
    // avatar.style.borderRadius = "50%"
}

setInterval(sweepAvatars, 1000)