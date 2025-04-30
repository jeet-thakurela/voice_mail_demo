//frontend/src/components/common/Sidebar.jsx
import React, { useContext } from 'react';
import { EmailContext } from '../../contexts/EmailContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { currentFolder, changeFolder } = useContext(EmailContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: '📥' },
    { id: 'sent', name: 'Sent', icon: '📤' },
    { id: 'drafts', name: 'Drafts', icon: '📝' },
    { id: 'trash', name: 'Trash', icon: '🗑️' },
    { id: 'spam', name: 'Spam', icon: '⚠️' }
  ];

  const handleFolderClick = (folderId) => {
    changeFolder(folderId);
    navigate(`/${folderId}`);
  };

  const handleComposeClick = () => {
    navigate('/compose');
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
      <button 
        className="compose-btn" 
        onClick={handleComposeClick}
      >
        ✉️ Compose
      </button>
      
      <nav className="folder-nav">
        <ul className="folder-list">
          {folders.map(folder => (
            <li key={folder.id}>
              <button
                className={`folder-item ${currentFolder === folder.id ? 'active' : ''}`}
                onClick={() => handleFolderClick(folder.id)}
              >
                <span className="folder-icon">{folder.icon}</span>
                <span className="folder-name">{folder.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;































// import React, { useContext } from 'react';
// import { EmailContext } from '../../contexts/EmailContext';
// import { ThemeContext } from '../../contexts/ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import '../../styles/Sidebar.css';

// const Sidebar = () => {
//   const { currentFolder, changeFolder } = useContext(EmailContext);
//   const { darkMode } = useContext(ThemeContext);
//   const navigate = useNavigate();

//   const folders = [
//     { id: 'inbox', name: 'Inbox', icon: '📥' },
//     { id: 'sent', name: 'Sent', icon: '📤' },
//     { id: 'drafts', name: 'Drafts', icon: '📝' },
//     { id: 'trash', name: 'Trash', icon: '🗑️' },
//     { id: 'spam', name: 'Spam', icon: '⚠️' }
//   ];

//   const handleFolderClick = (folderId) => {
//     changeFolder(folderId);
//     navigate(`/${folderId}`);
//   };

//   const handleComposeClick = () => {
//     navigate('/compose');
//   };

//   return (
//     <div className={`sidebar ${darkMode ? 'dark' : 'light'}`}>
//       <button className="compose-button" onClick={handleComposeClick}>
//         ✉️ Compose
//       </button>

//       <ul className="folder-list">
//         {folders.map(folder => (
//           <li key={folder.id} onClick={() => handleFolderClick(folder.id)} className={currentFolder === folder.id ? 'active' : ''}>
//             {folder.icon} {folder.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
