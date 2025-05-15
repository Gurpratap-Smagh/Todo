// script.js
async function signUp() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    var d=[];

    if (!name || !password) {
        show("Name and Password cannot be empty.");
        return;
    }
    try{
        const r = await fetch('http://localhost:3000/signup',{
          method: 'POST',
             headers: {
                  'Content-Type': 'application/json'
                },
            body: JSON.stringify({ name, password,d })
         });
        const result = await r.text();
            show(result);

            if (r.ok) {
                localStorage.setItem('username', name);
                window.location.href = 'todo.html';
            }   
    }catch(error){
        alert("unable to sign in, me gareeb hu");
        console.error(error);
    }
    
}
async function login() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    try{
        const dope=await fetch('http://localhost:3000/login',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({ name, password })
            

        });
        if(dope.ok){
            localStorage.setItem('username', name);
            window.location.href = 'todo.html';
        }
    }catch(error){
        alert("chor chor chor");
        console.error(error);
    }


}
//---------------------------//
const papa = document.getElementById("in");
function add() {
    const task = document.getElementById('text').value;
    const time = document.getElementById('time').value;

    const dad = document.createElement("div");
    dad.className = "dad";  // Correctly styled container

    // Add task text and time directly inside the .dad
    dad.innerHTML = `
        <div class="ga">${task}</div>
        <div class="gi">${time}</div>
    `;

    const button = document.createElement("div");
    button.className = "delete";
    button.innerText = "delete";
    button.innerHTML = '<i class="fas fa-trash"></i>';
    button.onclick = function() {
        delete_(task, time);
        dad.classList.add("slide-out");
        
        setTimeout(() => {
            dad.remove();
        }, 1000); // Matches animation duration
    };

    dad.appendChild(button);
    papa.appendChild(dad);
    duh(task, time);
    document.getElementById('text').value = "";

    document.getElementById('time').value = "";
}

async function duh(task,time){
    const name=localStorage.getItem('username');
    const r = await fetch('http://localhost:3000/save',{
          method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, time, name})
    });
        const result = await r.text();
            show(result);

            if (r.ok) {
                console.log("saved");
            }   
}
async function delete_(task, time)
{
    const name=localStorage.getItem('username');
    const r = await fetch('http://localhost:3000/delete',{
          method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, time, name})
    });
        const result = await r.text();
            show(result);

            if (r.ok) {
                console.log("saved");
            }   
}
function logout() {
    localStorage.removeItem('username');
    window.location.href = 'i.html'; // Redirect to login page
}
// Show Popup Notification
function show(message) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.classList.remove("hidden");
    notification.classList.add("show");

    // Automatically hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
    }, 3000);
}

