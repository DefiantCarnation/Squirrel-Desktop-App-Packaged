import React from 'react';
import FolderContainer from './folder/folderContainer.jsx';

var SidebarPresentation = (props) => {

  var folders = props.folders.map((folder, index) => {
    return (<li className="folder-list-item" key={index}><FolderContainer folder={folder} loadFolder={props.loadFolder}/></li>)
  });

  return (
    <ul style = {{display:'inline-block',float: 'left','listStyleType': "none"}}>
      {folders}
    </ul>
  )
};

export default SidebarPresentation;