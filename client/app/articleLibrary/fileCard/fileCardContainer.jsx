import React from 'react';

class FileCardContainer extends React.Component {

  constructor(props) {
    super(props);
  }

  findsecondslash(string) {
    var foundone = 0;
    var indextoreturn;
    string.split('').forEach(function(char,index) {
      if(char === "/"){
        if (foundone === 0){
          foundone = 1;
        } else {
          indextoreturn = index;
        }
      }
    });

    return indextoreturn + 1;
  }

  expand(url) {
    console.log(url);                    
    //const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;

    var win = new BrowserWindow({ width: 800, height: 600 });
    console.log('NEW howdy')
    console.log('total','file://' + url + '/article.html')
    var toload = 'file://' + url + '/article.html';

    win.loadURL(toload);
    win.webContents.openDevTools()
  }

  render() {
    var regexFinal = /[^\/]+$/
    var regexAfterApp = /app.*app\/([\s\S]+)$/
    var title = regexFinal.exec(this.props.path)[0];
    var imageFolder = __dirname + '/' + regexAfterApp.exec(this.props.path)[1] + '/images/';
    console.log('imageFolder', imageFolder);
    // console.log('this.props.path', this.props.path);
    // console.log(title);
    try {
      var image = `Stash/Me/Mine/${title}/images/${fs.readdirSync(imageFolder)[10]}`;
      console.log(image);
    } catch (err) {
      console.log(err);
      var image = 'client/assets/default.png';
    }
    // console.log('dirname', __dirname);
    // console.log(image);
    return (
      <div className = "articleBox" onClick={() => this.expand.bind(this)(this.props.path)} draggable="true" onDragStart={function(event){drag(event)}}>
        <img className="articleImage" src={image}/>
        <div className="articleTitle">
          <h3> {title}</h3>
        </div>
      </div>
    );
  }
};

export default FileCardContainer;