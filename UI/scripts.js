function activate()
{
  var coll = document.getElementsByClassName("collapsible");

      for (var i = 0; i < coll.length; i++) 
      {
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var content = this.nextElementSibling;
          if (content.style.maxHeight){
            content.style.maxHeight = null;
          } else {
            content.style.maxHeight = content.scrollHeight + "px";
          } 
        });
      }      
}

window.onload = start

const BASE_URL = "https://api20220107075545.azurewebsites.net/api/";
function start()
{
  getAll()
}

function sendToDB()
{  
  name_ = document.getElementById('name-collapse').value
  content = document.getElementById('content-collapse').value
  if(name_ ==='' || content ==='') 
  {
    alert('Textarea is empty') 
    return
  } 

  let collapse = {
    id: getIndex(),
    name: name_,
    content: content
  }  
  let data = JSON.stringify(collapse)
  let request = new XMLHttpRequest();

  request.open("POST",  BASE_URL + "collapse/add", true);
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("Content-Type", "application/json");

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      window.location.reload();        
}};
  request.send(data);
 

  document.getElementById('name-collapse').value = ''
  document.getElementById('content-collapse').value = ''
}

async function getAll()
{
  var collapses = []
  var request = new XMLHttpRequest();
  request.open("GET", BASE_URL + "collapse/all", true); 
   

  request.onreadystatechange = function() {     
    if (request.readyState == 4 && request.status == 200)
    {     
      let response = request.responseText
      var objs = JSON.parse(response)
      objs.forEach(element =>
         { collapses.push(element)})

      if(collapses.length != 0)
      {
        let path = window.location.pathname;
        let page = path.split("/").pop();
  
        if(page === "index3.html") { createCollapseAdmin(collapses) }
        else if(page === "index4.html") { createCollapseUser(collapses) }
      }
      activate()
    } 
  }

  try
  {
    request.send();
  }
  catch(e)
  {
    console.log(e.responseText)
  }
 
  
}
  

function createCollapseAdmin(collapses)
{
  collapses.forEach(collapse => {
    let div = document.createElement("div")
    div.style.display = 'flex';
    div.style.justifyContent = 'center'     

    let id = document.createElement("p")
    id.innerText = collapse.id

    let name = document.createElement("p")
    name.innerText = collapse.name

    let content = document.createElement("p")
    content.innerText = collapse.content

    let btn = document.createElement("button") 
    btn.style.height ='20px';
    btn.style.width ='20%';          
    btn.innerText = "del"
    btn.addEventListener('click', (e) =>
      {
        e.preventDefault()
        deleteCollapse(collapse.id)
      })

    div.appendChild(id)
    div.appendChild(name)
    div.appendChild(content)
    div.appendChild(btn)

    document.getElementById("control-collapse").appendChild(div)

  });
}

function createCollapseUser(collapses)
{
  collapses.forEach(collapse => {
    let div = document.createElement("div")
    div.id = collapse.id

    let btn = document.createElement("button")
    btn.className = "collapsible"
    btn.innerText = collapse.name

    let content = document.createElement("div")
    content.className = "content"

    let contentText = document.createElement("p")
    contentText.innerText = collapse.content

    content.appendChild(contentText)
    div.appendChild(btn)
    div.appendChild(content)
    
    document.getElementById("user-panel").appendChild(div)
  });
}

function deleteCollapse(id)
{
  var request = new XMLHttpRequest();
  request.open("DELETE", BASE_URL + "collapse/delete?id="+id, true);

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      window.location.reload();
  }}; 

  request.send()  
}

function getIndex() {
  var now = new Date();
  let seconds = now.getSeconds();
  if(seconds <10) seconds = '0'+seconds;
  var str = "" + now.getDate() + now.getHours() + now.getMinutes()+ seconds ;
  return parseInt(str);
}
