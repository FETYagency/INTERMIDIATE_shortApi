const shortBtn = document.querySelector(".shortBtn");
const input = document.querySelector(".input");
const links = document.querySelector(".links");
const goTo = document.querySelectorAll(".startBtn")


if(localStorage.length>0){
    links.innerHTML=localStorage.getItem("links")
    alert(`press {CTRL + X} to remove the local storage`)
}

let baseUrl = "https://api.shrtco.de/v2/";
let givenUrl;
function fetchResults(e) {
    e.preventDefault()
    
    givenUrl = input.value;
    let url = `${baseUrl}shorten?url=${givenUrl}`;
    let validateUrl = /https:\/\/.+/
    fetch(url)
    .then(resp=>{
        if(givenUrl===""){
            throw(new Error("put a URL!"))
        }else if(validateUrl.test(givenUrl)===false){
            throw(new Error("the given URL is not valid!"))
        }
        return resp.json()
    })
    .then(link=>{
        const li = document.createElement("li");

        const oldLink = document.createElement("p");
        oldLink.classList.add("currLink");
        oldLink.textContent = link.result.original_link;

        const div = document.createElement("div");
        div.classList.add("newLink");

        const newLink = document.createElement("p");
        newLink.classList.add("link");
        newLink.textContent = link.result.full_short_link;

        const btn = document.createElement("button");
        btn.classList.add("copyBtn");
        btn.textContent = "Copy";

        li.append(oldLink);
        li.append(div);

        div.append(newLink);
        div.append(btn);

        links.prepend(li)

        const saves = links.innerHTML;
        localStorage.setItem("links", saves)
        console.log(localStorage)
    })
    .catch(err=>{
        input.classList.add("error");
        input.placeholder= err;
        shortBtn.disabled = true;
        setTimeout(()=>{
            input.classList.remove("error")
            input.placeholder= "Shorten a link here...";
            shortBtn.disabled = false;
        }, 1000)
    })

    input.value=""
};

shortBtn.addEventListener("click", fetchResults);

document.body.addEventListener("click", e=>{
    if(e.target.matches(".copyBtn")){
        const curr = e.target;
        const link = curr.parentElement.querySelector(".link").textContent
        navigator.clipboard.writeText(link)
        curr.dataset.act = "clicked"
        curr.textContent="Copied!"
        setTimeout(()=>{
            curr.dataset.act = "none"
            curr.textContent="Copy"
        }, 400)
    }
})

goTo.forEach(e=>{
    e.addEventListener("click",()=>{
        window.scrollTo({
            top: 629,
            behavior: "smooth",
        });
    })
})

const navBtn = document.querySelector("#burger")
const nav = document.querySelector(".M_nav")
navBtn.addEventListener("click", ()=>{
    if(navBtn.checked===true){
        nav.dataset.state="open"
    }else{
        nav.dataset.state="close"
    }
})
window.addEventListener("scroll", ()=>{
    nav.dataset.state="close"
    navBtn.checked=false
})

const media = window.matchMedia("(min-width:750px)");
media.addEventListener("change", ()=>{
    nav.dataset.state="close"
    navBtn.checked=false
})

document.body.addEventListener("keydown", (e)=>{
    if(e.ctrlKey){
        if(e.key==="x"){
            alert(`becarful!! you're going to delete all your local storage`)
            localStorage.clear();
            links.innerHTML=""; 
        }
    }
})