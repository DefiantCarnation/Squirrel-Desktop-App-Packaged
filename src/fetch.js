var request = require('request-promise');
var cheerio = require('cheerio');
var gl = require('./getLinks.js');
var Promise = require('bluebird');
var fs = require('fs')
var AutoLaunch = require('auto-launch');
console.log('FETCHED');
console.log(fs)


var FetchAutoLauncher = new AutoLaunch({
    name: 'Minecraft',
    path: __dirname + '/fetch.js',
});
 
FetchAutoLauncher.enable();
 
//minecraftAutoLauncher.disable(); 
 
 
FetchAutoLauncher.isEnabled()
.then(function(isEnabled){
    if(isEnabled){
        return;
    }
    FetchAutoLauncher.enable();
})
.catch(function(err){
    // handle error 
});

var id = require('../fbkeys.js').id; //<== hard coded for now. We need to figure out how to get desktop user ID from DB
var name = require('../fbkeys.js').name; // need a way to log int to get these before hand!

var linksArray = [];

exports.call = () => {
//  console.log('IN CALL')
  request(`http://45.55.15.147:8888/links/${id}`)
  .then((data1) => {
    console.log(data1, 'what is in data1');
    data1 = JSON.parse(data1);
    extractMyLinks(data1);
    request(`http://45.55.15.147:8888/friends/${id}`)
    .then((data2) => {
      data2 = JSON.parse(data2);
      extractFriendLinks(data2)
    });
  })
  .then(() => {

    
    var thisfilepath = __dirname
    var toplevel = thisfilepath.replace('/src','');
    console.log('HEREINFETCH');
    if(fs.readdirSync(toplevel).indexOf('currentlysaved.txt') === -1){

      console.log('NO previously cached file found');
      var newLinks = linksArray.map(function(tuple){return tuple[0]});

      fs.writeFileSync(__dirname.replace('/src',"") + '/currentlysaved.txt',JSON.stringify(newLinks));
      Promise.reduce(linksArray, (_, [link, filePath]) => {
      return gl.getPage(link, filePath);
      }, null);
    } else {
      //console.log('WRITINGTO',__dirname.replace('/src',"") + '/currentlysaved.txt');
     //request(`http://localhost:8888/friends/${id}`)
     fs.writeFileSync(__dirname + '/testing.txt','MADE IT IN TESTING');
     var alreadyStored = JSON.parse(fs.readFileSync('currentlysaved.txt'));
      //get the newlinks
      console.log('linksArray', linksArray);
      linksArray = linksArray.filter(function(linkobj){
      return alreadyStored.indexOf(linkobj[0]) === -1;
      })

    if (linksArray.length>0){
      console.log('Adding',linksArray);
      var toSave = alreadyStored.concat(linksArray.map(function(link){return link[0]}));
      console.log('Saving',toSave);
      console.log('Caching',linksArray);
      fs.writeFileSync('currentlysaved.txt',JSON.stringify(toSave));
       Promise.reduce(linksArray, (_, [link, filePath]) => {
      return gl.getPage(link, filePath);
      }, null);
    }

    }  

  })
  .catch((err) => {
    console.log('Error handling initial requests', err);
  });

};

function extractMyLinks(data) {
  var linkObjectArray = data[0];
  var index = data[1];
  linkObjectArray.forEach((linkObject) => {
    var link = linkObject.url;
    var ownerid = linkObject.owner;
    var userid = linkObject.assignee;
    var username = index[userid];
    var filePath = makeFilePath(ownerid, userid, username);
    linksArray.push([link, filePath]);
  });
};

function extractFriendLinks(data) {
  data.forEach((friendObject) => {
    console.log(friendObject, 'friendObject');
    var username = friendObject.fbname; //<==== WHATS HERE
    var linkObjectArray = friendObject.links;
    linkObjectArray.forEach((linkObject) => {
      var link = linkObject.url
      var ownerid = linkObject.owner;
      var userid = linkObject.assignee;
      var filePath = makeFilePath(ownerid, userid, username);
      linksArray.push([link, filePath]);
    });
  });
};

function makeFilePath(ownerid, userid, username) {
  var path;
  if (ownerid !== id) {
    path = __dirname.replace('/src',"") + `/Stash/${username}/`
  } else {
    if (userid !== id) {
      path = __dirname.replace('/src',"") + `/Stash/Me/Recommended/${username}/`;
    } else {
      path = __dirname.replace('/src',"") + `/Stash/Me/Mine/`
    }
  }
  console.log('path',path)
  return path;
};
