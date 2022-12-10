const fetch = require("node-fetch")
const spoon = require('./boss/splatoon')
const byaml = require('./boss/byaml')
const boss = require('boss-js')
const { BOSS_AES_KEY, BOSS_HMAC_KEY } = require('../config.json');

var splatfestcache = []
var rotationcache = []
var timecache = []

var optdat2 = "https://npts.app.pretendo.cc/p01/tasksheet/1/rjVlM7hUXPxmYQJh/optdat2?c=CA&l=en"
var schdat2 = "https://npts.app.pretendo.cc/p01/tasksheet/1/rjVlM7hUXPxmYQJh/schdat2?c=CA&l=en"

async function httpGetAsync(theUrl,parase)
{
    const response = await fetch(theUrl);
    if (response.status === 200){
        if (parase){
            const body = await response.text();
            return GrabFileUrlFromXML(body)
        }
        return response.arrayBuffer()
    }
    return null
}

async function GetSplatfestData(){
   if (ShouldRefresh()) {
    try {
   const files = await httpGetAsync(optdat2,true)
   const maininfofile = await httpGetAsync(files[0])
   const mainfobymal = boss.decrypt(Buffer.from(maininfofile),BOSS_AES_KEY,BOSS_HMAC_KEY)
   const mainfilearray = new byaml(mainfobymal.content).root
   splatfestcache = [spoon.getSplatfestTeam(mainfilearray),spoon.getSplatfestTime(mainfilearray),spoon.getSplatfestMapRotation(mainfilearray),spoon.getSplatfestsMapIDs(mainfilearray),spoon.getSplatfestMode(mainfilearray)]
    } catch (c) {
        console.warn(c)
        return null
    }
   }
   return splatfestcache
   //TODO Get the Splatfest Cover
}

async function GetMapRotations(){
    if (ShouldRefresh()) {
     try {
    const file = await httpGetAsync(schdat2,true)
    const maininfofile = await httpGetAsync(file)
    const mainfobymal = boss.decrypt(Buffer.from(maininfofile),BOSS_AES_KEY,BOSS_HMAC_KEY)
    const mainfilearray = new byaml(mainfobymal.content).root
    rotationcache = spoon.getCurrentRotations(mainfilearray)
    SetTimeCache()
     } catch (c) {
        console.warn(c)
        return null
     }
    }
    return rotationcache
}

function GrabFileUrlFromXML(content){
   var files = content.split("<Files>")
   files = files[1].split("</Files>")[0]
    if (files.split("<File>").length > 2){
        //Mutiple Files
        var filesurl = []
        for (let i = 1;i < files.split("<File>").length;i++){
            var file = files.split("<File>")[i]
            file = file.split("</File>")[0]
            var fileurl = file.split("<Url>")[1].split("</Url>")[0]
            filesurl.push(fileurl)
        }
        return filesurl
    }
    else {
        //Single File
        file = files.split("<File>")[1]
        file = file.split("</File>")[0]
        fileurl = file.split("<Url>")[1].split("</Url>")[0]
        return fileurl
    }
    
}

function UseNintendoRotation(status){
    if (status){
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
optdat2 = optdat2.replace("pretendo.cc","nintendo.net")
schdat2 = schdat2.replace("pretendo.cc","nintendo.net")
    }
}

function ShouldRefresh() {
    if (splatfestcache.length === 0 || rotationcache.length === 0 || timecache.length === 0) {
        return true
    }
    const UTCDate = new Date().toUTCString()
    const UTCArray = UTCDate.split(" ")
    const UTC = [UTCArray[1],UTCArray[2],UTCArray[3],UTCArray[4].split(":")[0]]
    return !UTC.every((val, index) => val === timecache[index])
}

function SetTimeCache() {
    const UTCDate = new Date().toUTCString()
    const UTCArray = UTCDate.split(" ")
    const UTC = [UTCArray[1],UTCArray[2],UTCArray[3],UTCArray[4].split(":")[0]]
    timecache = UTC
}

module.exports = {
    GetSplatfestData,
    GetMapRotations,
    UseNintendoRotation
}