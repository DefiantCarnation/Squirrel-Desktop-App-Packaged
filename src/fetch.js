var axios = require('axios');
var fs = require('fs');
var cheerio = require('cheerio');

var id = '10105564501516258'; //<== hard coded for now. We need to figure out how to get desktop user ID from DB
var name = 'Michael Wong'; // need a way to log int to get these before hand!

console.log('I ran! Definitely');

module.exports.call = () => {
  //Mike's ridiculous refactoring data code below... :/
  axios({
  method: 'get',
  url: `http://localhost:8888/links/${id}`
  // params: {
  //   userid: id
  // }
  })
  .then((res) => {
    

    var linksObject = { 
      ownLinks: {},
      recommendedLinks: {},
    };
    //console.log(res.data);
    res.data.forEach((curr) => {
      if(curr.assignee === id){
        linksObject.ownLinks[`${id}%${name}`] = linksObject.ownLinks[`${id}%${name}`] || [];
        linksObject.ownLinks[`${id}%${name}`].push(curr.url);
      } else {
        linksObject.recommendedLinks[`${curr.assignee}`] = linksObject.recommendedLinks[`${curr.assignee}%`] || [];
        linksObject.recommendedLinks[`${curr.assignee}`].push(curr.url);
      }
    })
    return {res: res, linksObject: linksObject};
  })
  .then((data) => {
    
    axios.get(`http://localhost:8888/friends/${id}`)
    .then((res2) => {
     // console.log(data, 'here is res2');
      //console.log(data);
      var friendsList = {};
      var linksObject = data.linksObject;
       console.log('res2.data',res2.data.friends)
       res2.data.friends.forEach(function(friend){
        //console.log('INSIDE');
        var friendId = friend.fbid;
        var friendName = friend.fbname;
        var friendLinks = friend.links.map((link) => {
          return link.url
        });
        if(linksObject.recommendedLinks[friendId]){
          linksObject.recommendedLinks[`${friendId}%${friendName}`] = linksObject.recommendedLinks[friendId];
          delete linksObject.recommendedLinks[friendId];
        }
        friendsList[friendId] = friendName;
        linksObject.ownLinks[`${friendId}%${friendName}`] = friendLinks;
       });

      ownLinks = linksObject.ownLinks
      recommendedLinks = linksObject.recommendedLinks;
      console.log('LINKS',ownLinks)
      for (key in ownLinks) {
        var userid = key.split('%')[0];
        var username = key.split('%')[1];
        getLinks(username, userid, ownLinks, key, 'Mine');
      }
      for (key in recommendedLinks) {
        var userid = key.split('%')[0];
        var username = key.split('%')[1];
        getLinks(username, userid, recommendedLinks, key, 'Recommended');
      }

    })
  })
  .catch((err) => {
    console.log(err);
  });
};
// DAMIEN JORDAN CODE BELOW 
// axios({
//   method: 'get',
//   url: `http://localhost:4000/links/${id}`
//   // params: {
//   //   userid: id
//   // }
//   })
//   .then((res) => {
//     linkObject = res.data;
//     ownLinks = res.data.ownLinks
//     recommendedLinks = res.data.recommendedLinks;
//     for (key in ownLinks) {
//       var userid = key.split('%')[0];
//       var username = key.split('%')[1];
//       getLinks(username, userid, ownLinks, key, 'Mine');
//     }
//     for (key in recommendedLinks) {
//       var userid = key.split('%')[0];
//       var username = key.split('%')[1];
//       getLinks(username, userid, recommendedLinks, key, 'Recommended');
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// };


function getLinks(username, userid, links, key, type) {
  for (var i = 0; i < links[key].length; i++) {
    var url = links[key][i];
    axios ({
      method: 'get',
      url: url
    })
    .then((res) => {
      var $ = cheerio.load(res.data);
      var title = $('title').text(); //.replace(/[\s|]/g, '');
      // console.log(title);
      if (userid === id) {
        var path = `Stash/Me/${type}/${title}.html`;
      } else {
        var dir;
        type === 'Mine' ? dir = `Stash/${username}/` : dir = `Stash/Me/Recommended/${username}`
        var path = `${dir}/${title}.html`;
        //console.log(path);  
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);           
        }
      }
      fs.writeFile(path, res.data, (err) => {
        if (err) {
          console.log('Err, yo', err);
        }
      });
    });
  }
};



// function get(link, username) {

//    var user = username;

//   return axios ({
//     method: 'get',
//     url: link
//   });
// };
