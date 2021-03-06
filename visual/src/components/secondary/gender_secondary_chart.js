import React,{Component} from 'react';
import Menu from '../menu/menu';
import {NavLink} from 'react-router-dom';
import GenderChart from '../genderchart/genderchart';
import {data} from '../../region_secondary';
class GenderSecondaryChart extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[]

        }
    }
    componentWillMount(){

    }
    render(){
        return(
            <div className="App">
            <Menu>
            <div className="menu-header" style={{
                alignItems:"flex-start",
            }}>
                <NavLink exact to="/secondary">Total dropouts in regions</NavLink >               
                <NavLink exact to="/secondary/gender">Male / Female dropouts in region</NavLink>
                <NavLink exact to="/secondary/district">total dropouts in districts</NavLink>
            </div>  
            <GenderChart data={data} />           
            </Menu> 

            </div>

        )
    }
}
export default GenderSecondaryChart;