var x;
var idArray = [];
//Set date
var today = new Date();
var date = (today.getMonth()+1) + '/' + today.getDate() + '/' +today.getFullYear();
var amOrPm;
var theHour;
//Convert military time to normal time
function convertTime() {
    amOrPm = "";
    theHour = today.getHours();
    
    if (theHour === 12) {
        amOrPm = "pm";
    }
    else if (theHour > 12){
        theHour = theHour - 12;
        amOrPm = "pm";
    }
    else {
        amOrPm = "am";
    }
}
//Live time function
function startTime() {
    var today = new Date();
    var h = theHour;
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('dateTime').innerHTML =
    "Current date: " + date + " " + h + ":" + m + ":" + s + amOrPm;
    var t = setTimeout(startTime, 500);
  }
  function checkTime(i) {
    if (i < 10) {i = "0" + i}; 
    return i;
  }

//Builds planner
function buildPlanner(){
    for (var i = 9; i < 18; i++){
        x = i;
        hourBlock(i);
    }
}

//Builds single empty planner object, with "i" incorporated from planner builder function
    var newId;
    var existingData;
    function hourBlock(x){ 
    //=====Dynamic time=====
    var time = x;
    
    var suffix;
    //9-11AM
    if (time >= 9 && time < 12){
        suffix = "AM"
    }
    //12-5PM
    else if (time >= 12){
        suffix = "PM"
        if (time > 12) {
            time = time - 12;
        }
    }
    //Write time with proper suffix (AM or PM) ---var fullTime---
    if (x > 12) {
        var fullTime = (x - 12) + suffix;
    }
    else {
        var fullTime = x + suffix;
    }
    //=====Past, present, or future?=====
    var blockState;
    var today = new Date();
    if (x > today.getHours()){
        //Set color to green for future blocks
        blockState = "green";
        
    }
    else if (x == today.getHours()){
        //Set color to red for current block
        blockState = "red";
        
    }
    else if (x < today.getHours()){
        //Set color to gray for past blocks
        blockState = "gray";
    }
    
    
    //Container selected
    var container = document.getElementById("container");
    //Div constructed
    var block = document.createElement("div");
    //Dynamic id representing all blocks
    newId = "block" + x;
    idArray.push(newId);
    block.setAttribute("id", newId);
    
    var para = document.createElement("p");
    var timeNode = document.createTextNode(fullTime);
    
    para.appendChild(timeNode);
    block.appendChild(para);
    container.appendChild(block);
    document.getElementById(newId).style.backgroundColor = blockState;
    
    //Creates textarea (referred to as field) with id [block9, ..., block17]
    addField(newId);
    //Creates span with id [spanblock9, ..., spanblock17]
    addSaveButton(newId);
    addClearButton(newId);
}

function addField(id){
    var box = document.getElementById(id);
    var field = document.createElement("textarea");
    field.setAttribute("id", "field" + id);
    field.setAttribute("class", "fieldgroup");
    field.setAttribute("onkeypress", "infoEvent(field" + id + ")");
    field.setAttribute("onmouseover", "hoverEvent(field" + id + ")");
    //Field var = fieldblock+i
    //Class containign fields: fieldgroup
    field.setAttribute("type", "text");
    existingData = sessionStorage.getItem("field" + id + "data");
    if (existingData === "") {
        
    }
    else if (existingData === ("field" + id + "data")){
        field.value = "";
    }
    else {
        field.value = existingData;
    }

    box.appendChild(field);
}
var lastField;
var ignore = true;
function hoverEvent(target) {
    
    var field = document.getElementById(target.id);
    
    if ((field != lastField) && (ignore == false)) {
        fadeOut(lastField);
    }
    lastField = field;
    
    ignore = false;
    field.style.backgroundColor = "white";
    field.addEventListener("keydown", (event) => {
    
    });
}

function fadeOut(target) {
    var r0 = 255;
    var g0 = 255;
    var b0 = 255;
    
    function fade(r, g, b){
        r0--;
        g0--;
        b0--;
        r = r0;
        g = g0;
        b = b0;
        target.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        if (r <= "211") {
            clearInterval(fadeTimer);
        }
    }
    var fadeTimer = setInterval(function(){ fade(r0, g0, b0); }, 10); //2200 ms duration
}

function borderFlash(target, type) {
    target.style.color = "transparent";
    var borderState = 2;
    var borderTimer = setInterval(function(){ flash(borderState); }, 220);
    function flash(a){
        //When type = save
        if (type === "save") {
            if (a % 2 == 0){
                target.style.borderColor = "green";
            }
            else {
                target.style.borderColor = "black";
            }
            borderState++;
            if (borderState > 8){
                clearInterval(borderTimer);
                target.style.borderColor = "black";
                borderState == 2;
                fadeOut(target);
            }
        }
        else if (type === "clear") {
            if (a % 2 == 0){
                target.style.borderColor = "red";
            }
            else {
                target.style.borderColor = "black";
            }
            borderState++;
            if (borderState > 8){
                clearInterval(borderTimer);
                target.style.borderColor = "black";
                borderState == 2;
            }
        }
    } 
}


function addSaveButton(id){
    var box = document.getElementById(id);
    var btn = document.createElement("span");
    btn.setAttribute("id", "save" + id);
    btn.setAttribute("class", "saveButton");
    btn.innerHTML = "Save";
    btn.style.backgroundColor = "lightgreen";
    btn.style.color = "black";
    box.appendChild(btn);
}

function addClearButton(id){
    var box = document.getElementById(id);
    var btn = document.createElement("span");
    btn.setAttribute("id", "clear" + id);
    btn.setAttribute("class", "clearButton");
    btn.innerHTML = "Clear";
    btn.style.backgroundColor = "red";
    btn.style.color = "white";
    box.appendChild(btn);
}

//Save/Clear button functionality
$(document).on("click", event => {
    var thisBtn = event.originalEvent.target.id
    if (thisBtn.charAt(0) == "s") {
        
        var formId = "field" + (thisBtn.substring(4));
        
        document.getElementById(formId).style.color = "black";
        var entry = document.getElementById(formId).value;
        
        sessionStorage.setItem(formId + "data", entry);
        var thisForm = document.getElementById(formId);
        
        if (entry.trim() == "" || entry == null) {
            
        }
        else {
            saveEntry(formId, entry);
            borderFlash(thisForm, "save");
        }
    }
    else if (thisBtn.charAt(0) == "c") {
        var formId = "field" + (thisBtn.substring(5));
        
        sessionStorage.setItem(formId + "data", "");
        var field = document.getElementById(formId);
        field.value = "";
        
        fadeOut(field);
        borderFlash(field, "clear");
    }
});

function start(){
    convertTime();
    startTime();
    buildPlanner(); 
}

//Use idArray

//

function infoEvent(id){
    //Identify which input field
    
    var entry = document.getElementById(id.id).value;
    
    sessionStorage.setItem(id.id + "data", entry);
    //Save new entry (enter key or save btn)
    $("#" + id.id).on('keypress', function(e) {
        if (e.which == 13) {
            
            borderEffect = true;
            saveEntry(id.id, entry);
        }
    });
}

var borderEffect;
function saveEntry(id, entry) {
    
    sessionStorage.setItem(id + "data", entry.trim());
    var savedData = sessionStorage.getItem(id + "data");
    $("#" + id).val(savedData);
    

    var thisId = id;
    thisId = thisId.substring(5);
    
    
    
    var targetElement = document.getElementById(id);
    
    //fadeOut(targetElement);
    if (borderEffect == true) {
        
        borderFlash(targetElement, "save");
        borderEffect = false;
    }
}

function clearAll() {
    sessionStorage.clear();
    window.location.reload();
}
