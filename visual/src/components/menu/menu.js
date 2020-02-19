import React,{Component} from 'react';
import './menu.css';
import Navigation from '../nav/nav'
import Footer from '../footer/footer';
class Menu extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    render(){
        return(
            <div className="menu">
                <Navigation />
                <div className="menu-ls">
                     
                    {this.props.children}
                    
                </div>
                <Footer />
            </div>
        )
    }
}
export default Menu;