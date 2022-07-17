let userElements = Array.from(document.getElementsByClassName("user") as HTMLCollectionOf<HTMLElement>)

function findChildByTagName(parent: HTMLElement, tagName: string): HTMLElement | undefined{
    for(const child of parent.children as HTMLCollectionOf<HTMLElement>){
        if(child.tagName === tagName){
            return child
        }
    }
}

function sweepAvatars(){
    console.log("Get sweeped, bud. Current # elements: "+userElements.length)

    for(const user of userElements){
        if(!user.classList.contains("empty") && !user.classList.contains("guest")){
            let avatarHolder = Array.from(document.getElementsByClassName("avatar") as HTMLCollectionOf<HTMLElement>)[0]
            let avatar = findChildByTagName(avatarHolder, "SPAN")
            if(!avatar){continue}


            avatar.style.backgroundImage = "url('https://static-cdn.jtvnw.net/jtv_user_pictures/fd195f6a-5b03-41d4-9e92-e8e4019fb9f8-profile_image-300x300.png')"
            avatar.style.borderRadius = "50%"
        }
    }
}

setInterval(sweepAvatars, 1000)