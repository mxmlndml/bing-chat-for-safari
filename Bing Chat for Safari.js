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
    const ID = "#waitListDefaultPayWall"
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
    title.innerText = "Unlock conversational search on Safari";
    
    // change description
    const description = waitList.querySelector(".contentContainer .description");
    description.innerText = "In order to use Bing Chat in Safari, you have to replace the User Agent of the current tab.";
    // how to edit ua string
    const list = document.createElement("ol");
    const listItems = Array.from({ length: 3 }).map((item) => document.createElement("li"));
    listItems[0].innerText = "Press the button to copy Microsoft Edge's User Agent";
    listItems[1].innerText = "Open Develop → User Agent → Other… from the menu bar";
    listItems[2].innerText = "Replace the text with the contents of your clipboard";
    listItems.forEach((item) => {
        item.style.listStyle = "decimal";
        item.style.marginLeft = "2em";
        list.appendChild(item);
    });
    list.style.fontSize = ".9em";
    description.appendChild(list);

    // edit button
    const link = waitList.querySelector("#codexMacPrimaryButton");
    link.ariaLabel = link.querySelector("span").innerText = "Emulate Microsoft Edge";
    link.href = "";

    // copy ua string
    link.addEventListener("click", (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(USER_AGENT_STRING);
        return false;
    });
})();
