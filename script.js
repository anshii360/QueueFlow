"use strict";

/* ===========================
   QueueFlow - script.js (Part 3A)
=========================== */

(() => {

const $ = (id) => document.getElementById(id);

// ----------------------
// Mobile Navigation
// ----------------------

const menuBtn = $("menuBtn");
const nav = $("nav");

if(menuBtn){

menuBtn.onclick = () =>{

nav.classList.toggle("active");

};

}

// ----------------------
// Login Modal
// ----------------------

const loginBtn = $("loginBtn");
const modal = $("loginModal");
const closeLogin = $("closeLogin");
const loginSubmit = $("loginSubmit");

if(loginBtn){

loginBtn.onclick = () =>{

modal.style.display="flex";

};

}

if(closeLogin){

closeLogin.onclick = () =>{

modal.style.display="none";

};

}

window.onclick=(e)=>{

if(e.target===modal){

modal.style.display="none";

}

};

// ----------------------
// Login
// ----------------------

if(loginSubmit){

loginSubmit.onclick=()=>{

const username=$("username").value.trim();

const password=$("password").value.trim();

const role=$("role").value;

if(username===""||password===""){

alert("Please fill all fields.");

return;

}

localStorage.setItem("queueflowUser",JSON.stringify({

username,

role

}));

alert("Welcome "+username+" ("+role+")");

modal.style.display="none";

};

}

// ----------------------
// Language Switcher
// ----------------------

const language=$("language");

const text={

en:{
book:"Book Appointment",
queue:"Current Queue"
},

hi:{
book:"अपॉइंटमेंट बुक करें",
queue:"वर्तमान कतार"
},

ta:{
book:"முன்பதிவு செய்யவும்",
queue:"தற்போதைய வரிசை"
},

te:{
book:"అపాయింట్‌మెంట్ బుక్ చేయండి",
queue:"ప్రస్తుత క్యూ"
},

bn:{
book:"অ্যাপয়েন্টমেন্ট বুক করুন",
queue:"বর্তমান সারি"
}

};

if(language){

language.onchange=()=>{

const lang=language.value;

document.querySelector("#booking h2").innerHTML=text[lang].book;

document.querySelector("#queue h2").innerHTML=text[lang].queue;

};

}

// ----------------------
// Booking
// ----------------------

const bookingForm=$("bookingForm");

let appointments=

JSON.parse(localStorage.getItem("appointments"))||[];

if(bookingForm){

bookingForm.onsubmit=(e)=>{

e.preventDefault();

const booking={

name:$("name").value,

email:$("email").value,

phone:$("phone").value,

service:$("service").value,

doctor:$("doctor").value,

date:$("date").value,

time:$("time").value,

id:"QF"+Date.now()

};

appointments.push(booking);

localStorage.setItem(

"appointments",

JSON.stringify(appointments)

);

alert(

"Appointment Booked!\nBooking ID: "+booking.id

);

bookingForm.reset();

updateDashboard();

};

}

// ----------------------
// Queue Data
// ----------------------

let queue=

JSON.parse(localStorage.getItem("queue"))||

[

{

name:"Rahul",

service:"Cardiology"

},

{

name:"Anita",

service:"Pediatrics"

},

{

name:"Vikas",

service:"Neurology"

}

];

const queueList=$("queueList");

function renderQueue(){

if(!queueList) return;

queueList.innerHTML="";

queue.forEach((item,index)=>{

const li=document.createElement("li");

li.innerHTML=

"<strong>"+

(index+1)+

". "+

item.name+

"</strong><br>"+

item.service;

queueList.appendChild(li);

});

localStorage.setItem(

"queue",

JSON.stringify(queue)

);

}

renderQueue();

})();
/* ===========================
   QueueFlow - script.js (Part 3B)
=========================== */

(() => {

// ----------------------
// Queue Controls
// ----------------------

const callNext = document.getElementById("callNext");
const skipPatient = document.getElementById("skipPatient");
const completePatient = document.getElementById("completePatient");

const channel = ("BroadcastChannel" in window)
  ? new BroadcastChannel("queueflow")
  : null;

function saveQueue() {
  localStorage.setItem("queue", JSON.stringify(queue));

  if (channel) {
    channel.postMessage(queue);
  } else {
    localStorage.setItem("queueUpdate", Date.now());
  }

  renderQueue();
  updateDashboard();
}

if (callNext) {

  callNext.onclick = () => {

    if (queue.length === 0) {
      alert("No patients waiting.");
      return;
    }

    const patient = queue.shift();

    alert(
      "Now Serving:\n\n" +
      patient.name +
      "\n" +
      patient.service
    );

    saveQueue();

  };

}

if (skipPatient) {

  skipPatient.onclick = () => {

    if (queue.length < 2) return;

    queue.push(queue.shift());

    saveQueue();

  };

}

if (completePatient) {

  completePatient.onclick = () => {

    alert("Patient marked as completed.");

    saveQueue();

  };

}

// ----------------------
// Dashboard
// ----------------------

function updateDashboard() {

  const app = document.getElementById("appointmentsCount");
  const wait = document.getElementById("waitingCount");

  if (app)
    app.innerHTML = appointments.length;

  if (wait)
    wait.innerHTML = queue.length;

}

updateDashboard();

// ----------------------
// Analytics Animation
// ----------------------

document.querySelectorAll(".fill").forEach(bar => {

  const width = bar.style.width;

  bar.style.width = "0";

  setTimeout(() => {

    bar.style.width = width;

  }, 300);

});

// ----------------------
// Counter Animation
// ----------------------

function animateCounter(el, end) {

  if (!el) return;

  let value = 0;

  const speed = Math.max(1, Math.ceil(end / 60));

  const timer = setInterval(() => {

    value += speed;

    if (value >= end) {

      value = end;

      clearInterval(timer);

    }

    el.innerHTML = value;

  }, 20);

}

// Optional animation
const appCounter = document.getElementById("appointmentsCount");

if (appCounter) {

  animateCounter(appCounter, appointments.length);

}

// ----------------------
// Live Sync
// ----------------------

if (channel) {

  channel.onmessage = e => {

    queue = e.data;

    renderQueue();

    updateDashboard();

  };

}

window.addEventListener("storage", e => {

  if (e.key === "queue") {

    queue = JSON.parse(localStorage.getItem("queue")) || [];

    renderQueue();

    updateDashboard();

  }

});

// ----------------------
// Load Existing User
// ----------------------

const user = JSON.parse(localStorage.getItem("queueflowUser"));

if (user) {

  console.log(
    "Logged in:",
    user.username,
    "(" + user.role + ")"
  );

}

// ----------------------
// Contact Form
// ----------------------

const contactForm = document.getElementById("contactForm");

if (contactForm) {

  contactForm.onsubmit = e => {

    e.preventDefault();

    alert(
      "Thank you!\nWe have received your message."
    );

    contactForm.reset();

  };

}

// ----------------------
// Initialize
// ----------------------

renderQueue();
updateDashboard();

})();