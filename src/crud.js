// crud.js

const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnUpdate = document.getElementById('btnUpdate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');

let pathName = path.join(__dirname, 'Files');
let stickyNotesContainer = document.getElementById('sticky-notes-container');

// Load existing sticky notes from localStorage on page load
window.addEventListener('load', function () {
    loadStickyNotesFromLocalStorage();
});

btnCreate.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    
    // Check if the file already exists
    if (fs.existsSync(file)) {
        alert("User already exists! Please choose a different name.");
        return;
    }

    let contents = fileContents.value;
    fs.writeFile(file, contents, function (err) {
        if (err) {
            return console.log(err);
        }
        alert(fileName.value + "'s favourite word is successfully posted!");
        displayStickyNote(fileName.value, contents);
        saveStickyNotesToLocalStorage(); // Save sticky notes to localStorage
        console.log("The file was created");
    });
});


btnRead.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    fs.readFile(file, function (err, data) {
        if (err) {
            return console.log(err);
        }
        fileContents.value = data;

        // Check if the sticky note with the same title already exists before adding it
        if (!stickyNoteExists(fileName.value)) {
            displayStickyNote(fileName.value, data);
            saveStickyNotesToLocalStorage(); // Save sticky notes to localStorage
        }
        alert(fileName.value + "'s favourite word was read!");
        console.log("The file was read!");
    });
});


btnDelete.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    fs.unlink(file, function (err) {
        if (err) {
            return console.log(err);
        }

        // Trim the title before removing the sticky note
        const trimmedTitle = fileName.value.trim();
        removeStickyNoteByTitle(trimmedTitle);

        fileName.value = ""; // Clear after removing the sticky note
        fileContents.value = "";

        saveStickyNotesToLocalStorage(); // Save sticky notes to localStorage
        console.log("The file was deleted!");
        alert(trimmedTitle + "'s favourite word was deleted! sad to see you go :(");
    });
});




btnUpdate.addEventListener('click', function () {
    let file = path.join(pathName, fileName.value);
    var newContent = fileContents.value;

    fs.writeFile(file, newContent, (err) => {
        if (err) {
            return console.log(err);
        }
        alert(fileName.value + "'s favourite word was updated! ");
        updateStickyNote(fileName.value, newContent);
        saveStickyNotesToLocalStorage(); // Save sticky notes to localStorage
        console.log("The file was updated!");
    });
});

// Function to remove sticky note by title
function removeStickyNoteByTitle(title) {
    const stickyNotes = stickyNotesContainer.querySelectorAll('.sticky-note');
    stickyNotes.forEach((stickyNote) => {
        const noteTitle = stickyNote.querySelector('h3');
        if (noteTitle && noteTitle.textContent === title) {
            stickyNotesContainer.removeChild(stickyNote);
        }
    });
}

// Function to update sticky note by title and content



function displayStickyNote(title, content) {
    const stickyNote = document.createElement('div');
    stickyNote.classList.add('sticky-note');
    stickyNote.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
    `;
    stickyNotesContainer.appendChild(stickyNote);
}




function updateStickyNote(title, content) {
    const stickyNotes = stickyNotesContainer.querySelectorAll('.sticky-note');
    stickyNotes.forEach((stickyNote) => {
        const noteTitle = stickyNote.querySelector('h3');
        const noteContent = stickyNote.querySelector('p');
        if (noteTitle && noteTitle.textContent === title) {
            noteContent.textContent = content;
        }
    });
}

function saveStickyNotesToLocalStorage() {
    const stickyNotes = stickyNotesContainer.innerHTML;
    localStorage.setItem('stickyNotes', stickyNotes);
}

function loadStickyNotesFromLocalStorage() {
    const savedStickyNotes = localStorage.getItem('stickyNotes');
    if (savedStickyNotes) {
        stickyNotesContainer.innerHTML = savedStickyNotes;
    }
}

function stickyNoteExists(title) {
    const stickyNotes = stickyNotesContainer.querySelectorAll('.sticky-note');
    for (const stickyNote of stickyNotes) {
        const noteTitle = stickyNote.querySelector('h3');
        if (noteTitle && noteTitle.textContent === title) {
            return true;
        }
    }
    return false;
}