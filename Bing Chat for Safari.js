// ==UserScript==
// @name        Bing Chat for Safari
// @description Instructions on how to use Bing Chat in Safari without downloading Microsoft Edge
// @include     /^https:\/\/(www\.)?bing\.com.*$/
// ==/UserScript==

USER_AGENT_STRING = 
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/111.0.1661.62"

if (navigator.userAgent === USER_AGENT_STRING) {
    return;
}

const getWaitList = () => new Promise((resolve) => {
    const ID = "#waitListDefault"
    let element = document.querySelector(ID);

    if (!!element) {
        // popup is visible
        resolve(element);
    }

    // wait until popup is added
    const observer = new MutationObserver((mutations) => {
        // flatten array [{ addedNodes: [...nodes] }] -> [nodes]
        const addedNodes = mutations.flatMap((record) => [...record.addedNodes]);
        // check if popup has been added
        const [popup] = addedNodes.filter((node) => node.id === "sydneyPayWall");
        element = popup?.querySelector(ID);
        
        if (!!element) {
            // popup is visible
            observer.disconnect();
            resolve(element);
        }
    });
    observer.observe(document.querySelector("#syd_paywall_container"), {
        childList: true
    });
});

(async () => {
    const waitList = await getWaitList();

    // change text
    const title = waitList.querySelector(".contentContainer .title");
    title.innerText = "Unlock conversational search on Safari"

    const link = waitList.querySelector(".actionContainer .link.secondary.fixed");
    link.querySelector("span").innerText = "Emulate Microsoft Edge";
    link.href = "";

    // how to change ua string
    const hint = document.createElement("div");
    hint.classList.add("actionContainer");
    hint.innerText = "Copied Microsoft Edge's User Agent!\nUse it in the current tab by selecting Develop > User Agent > Other… from the menu bar. Replace the old User Agent with the one in your clipboard and press OK."
    hint.hidden = true;
    waitList.appendChild(hint);

    // show hint and copy ua string
    link.addEventListener("click", (event) => {
        event.preventDefault();

        navigator.clipboard.writeText(USER_AGENT_STRING)
        hint.hidden = false
        
        return false;
    })
})()