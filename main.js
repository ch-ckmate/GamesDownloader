// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path')
const fs = require('fs');
let mainWindow;
let splash
const EventEmitter = require('events');
const { time } = require('console');
const loadingEvents = new EventEmitter()
const {shell} = require('electron');




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        frame: false,
        show:false,
        backgroundColor: '#FFF',
        resizable:false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html');  

    //mainWindow.webContents.openDevTools();


  
    //
    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

async function loop_iteration(json, i, arr) {
    arr.push(`<a onClick="show(this.id)" class="cell" id=${i}><div id="titolo">${json[i].title}</div> </a>`)
    arr.push(`<div class="info" id=${i}><h1>${json[i].title}</h1> <p id="size">Game Size: ${json[i].size}</p> <p id="update">Last Update: ${json[i].date}</p> <p id="torrent">Download Torrent: </p><a href=${json[i].magnet} id="magnet">Download</a> <div  id=${i} onclick="show1(this.id)" class="button2">X</div></div>`)

}



//href="${json[i].magnet}"
async function loop(json) {
    const arr = []
    for (let i in json) {
        await loop_iteration(json, i, arr);
    }
    mainWindow.webContents.executeJavaScript(`document.getElementById("grid").innerHTML += '${arr.join('')}'`)
}

function additem() {
    fs.readFile(path.join(__dirname, 'list.json'), 'utf8', (err, data) => {
        if (err) {
            alert('Could not read file.\n\nDetails:\n' + err.message)
            return
        }
        let json = JSON.parse(data)
        loop(json);

    })
}

//////////////////////////////////////////////////////////////////////////////////////////
async function loopp_iteration(json, i, arrn) {
    arrn.push(`<a onClick="rungame(this.id)" class="cell2" id="${json[i].gamepath}"><img src="${json[i].image}" id="imgstre"/><div id="titolo2">${json[i].title}</div> </a>`)
    

}


async function loopp(json) {
    const arrn = []
    for (let i in json) {
        await loopp_iteration(json, i, arrn);
    }
    mainWindow.webContents.executeJavaScript(`document.getElementById("grid2").innerHTML += '${arrn.join('')}'`)
}


function addgame() {
    fs.readFile(path.join(__dirname, 'game.json'), 'utf8', (err, data) => {
        if (err) {
            alert('Could not read file.\n\nDetails:\n' + err.message)
            return
        }
        let json = JSON.parse(data)
        loopp(json);

    })
}


addgame();
additem();


const sleep = (delay) => {  
    return new Promise(resolve => {  
      setTimeout(resolve, delay)  
    });  
  }

function puziale () {
    splash = new BrowserWindow({width: 200, height: 200, transparent: true, frame: false, alwaysOnTop: true});
    (async ()=>{  
        createWindow(); 
        splash.loadFile('splash.html');  
        await sleep(2000);  
        splash.destroy();
        mainWindow.show()

      })();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', puziale);


// Quit when all windows are closed.

app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// dont use row as a container anymore, take the parent element



app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
