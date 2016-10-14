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
    
  }

  render() {
    var regexFinal = /[^\/]+$/
    var regexAfterApp = /app\/([\s\S]+)$/
    var title = regexFinal.exec(this.props.path)[0];
    console.log(this.props.path, 'propsprops')
    console.log(imageFolder, 'imageFolder');
    var imageFolder = __dirname + '/' + regexAfterApp.exec(this.props.path)[1] + '/images/';
    console.log('imageFolder', imageFolder);
    // console.log('this.props.path', this.props.path);
    // console.log(title);
    try {
      var image = fs.readdirSync(imageFolder)[5];
      if (!image) {
        imagePath = 'client/assets/default.png';
      } else {
        imagePath = `Stash/Me/Mine/${title}/images/${image}`;
      }

    } catch (err) {
      console.log(err);
      var imagePath = 'client/assets/default.png';
    }
    // console.log('dirname', __dirname);
    // console.log(image);
    return (
      <div className='articleCard' style={{position: 'relative', display: 'flex', flexDirection: 'row', backgroundPosition: 'center', backgroundSize: 'cover', margin: '8px'}} onClick={() => this.expand.bind(this)(this.props.path)} draggable="true" onDragStart={function(event){drag(event)}}>
        <div className="articleHeader"></div>
        <div className='articleTitle' style={{paddingLeft: '10px', position: 'absolute', top: '23%', width: '100%'}}>
          <h5>{title}</h5>
        </div>
        <div className='minisquirrel'></div>
        <div className='articleFooter'></div>
      </div>
    );
  }
};

export default FileCardContainer;