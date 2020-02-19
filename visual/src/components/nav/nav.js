import React,{Component} from 'react';
import './nav.css';
import logo from './logo.jpg'
import dropout from './dropout.JPG'
import {NavLink} from 'react-router-dom';
class Navigation extends Component{
    constructor(props){
        super(props);
        this.state={

        }
        this.logout=this.logout.bind(this);
    }
    logout(){
        localStorage.removeItem('usertoken')
        window.location.replace('/');
    }
    render(){
        return(
        <nav>
            <img src ={dropout} alt="logo" width ='100' height='100' />
            <ul>    
               <li><NavLink to="/home" activeClassName="active">Home</NavLink></li> 
               <li><NavLink to="/secondary" activeClassName="active">Secondary schools</NavLink></li> 
               <li> <NavLink to="/primary" activeClassName="active">Primary Schools</NavLink></li>
               <li><NavLink to="/upload" activeClassName="active">Upload data</NavLink></li>
            </ul> 
            <img src ={logo} alt="logo" width ='100' height='100' />         
        </nav>
        )
    }
}
export default Navigation;
