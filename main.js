
const start = function(){
    loadProjects();
};

function loadProjects(){
    const req = new XMLHttpRequest();
    req.open("get", "./projects.json");
    req.onload = (err) => {
        if (req.status != 200){
            console.error(err);
            return;
        }
        createProjectsButtons(JSON.parse(req.response));
    };
    req.send();
}

function createProjectsButtons(projects){
    const template = document.getElementsByTagName("template")[0];

    for (let item of projects){
        const elem = template.content.cloneNode(true);
        elem.querySelector("section").style.backgroundImage = `url(${item.img})`;
        elem.querySelector("h2").innerHTML = item.title;
        elem.querySelector("p").innerHTML = item.description;
        elem.getElementById("language").innerHTML = item.language;
        elem.getElementById("date").innerHTML = item.date;
        elem.querySelector("div").onclick = function(){ window.open(item.url) };

        document.getElementsByClassName("projects")[0].append(elem);
    }

}
