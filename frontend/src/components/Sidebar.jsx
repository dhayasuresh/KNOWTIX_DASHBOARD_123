import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiCheckCircle, FiCalendar, FiUsers, FiClock, FiTool, FiCpu, FiAward, FiFileText, FiGrid, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import '../styles/components.css';


const links = [
  { name:'Dashboard', icon:<FiHome/>, path:'/dashboard' },
  { name:'Assessments', icon:<FiCheckCircle/>, path:'/assessments' },
  { name:'AI Content', icon:<FiCpu/>, path:'/ai-content' },
  { name:'Calendar', icon:<FiCalendar/>, path:'/calendar' },
  { name:'Collaboration', icon:<FiUsers/>, path:'/collaboration' },
  { name:'CodeEditor', icon:<FiUsers/>, path:'/code-editor' },
  { name:'Formulas', icon:<FiFileText/>, path:'/formulas' },
  { name:'Math Tools', icon:<FiTool/>, path:'/math-tools' },
  { name:'Notes', icon:<FiFileText/>, path:'/notes' },
  { name:'Resources', icon:<FiGrid/>, path:'/resources' },
   { name:'Study Materials', icon:<FiBook/>, path:'/study-materials' },
  { name:'Timer', icon:<FiClock/>, path:'/timer' },
  { name:'Achievements', icon:<FiAward/>, path:'/achievements' },
  { name:'Settings', icon:<FiSettings/>, path:'/settings' },
  { name:'Logout', icon:<FiLogOut/>, path:'/logout' },
];

export default function Sidebar(){
  return (
    <div className="sidebar">
      <div className="brand"><div className="logo">K</div> Knowtix </div>
      <nav className="nav">
        {links.map(link=>(
          <NavLink key={link.name} to={link.path} className={({isActive})=>isActive?'active':''}>
            <span className="icon">{link.icon}</span>
            <span className="label">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
