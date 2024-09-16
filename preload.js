const { contextBridge, ipcRenderer } = require('electron')  
// let {ha_accts} = require("./data_sets/ha_accts.js");

const API = {
    send: (channel, data) => {
        console.log(channel, data)
        ipcRenderer.send(channel, data)
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
        console.log(channel);
        console.log(args);
    },
    appData: {rows: []}
}

contextBridge.exposeInMainWorld('api', API)                                                                                                                                                

ipcRenderer.on('resData', (event, data) => {
    // console.log('preload-resData: ', data )
    window.postMessage({type: 'resData', data: data}) // send to renderer
})

ipcRenderer.on('gotResDetail', (event, data) => {
    // console.log('preload-resData: ', data )
    window.postMessage({type: 'gotResDetail', data: data}) // send to renderer
})


