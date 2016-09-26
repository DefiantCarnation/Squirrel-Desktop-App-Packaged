require('../scss/main.scss');

import React from 'react';
import {render} from 'react-dom'
import fs from 'fs';
import path from 'path';
import Sidebar from './sidebar.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  loadFolder() {
    console.log('You loaded a folder!')
  }

  render() {
    return
      (
        <Sidebar folders={props.folders} loadFolder={this.loadFolder.bind(this)}/>
    );
  }
};

var srcpath = `${__dirname}/../Stash/Jordan/`;
var getFolders = function() {


  // return fs.readdirSync(srcpath).filter(function(file) {
  //   return fs.statSync(path.join(srcpath, file)).isDirectory();
  // });
}

render(<App folders={[srcpath]}/>, document.getElementById('app'));