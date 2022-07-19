chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ players: [{
      username: "OnlyTwentyCharacters",
      imageURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/fd195f6a-5b03-41d4-9e92-e8e4019fb9f8-profile_image-300x300.png"
    },
    {
      username: "asdf",
      imageURL: "https://static-cdn.jtvnw.net/jtv_user_pictures/jerma985-profile_image-447425e773e6fd5c-300x300.jpeg"
    }] });
    console.log('Added default list of user configs');
  });