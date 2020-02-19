import React,{Component} from 'react';
import Menu from '../menu/menu';
import {NavLink} from 'react-router-dom';
import DistrictChart from '../districtchart/districtchart';
import {data} from '../../council_primary';
class DistrictPrimaryChart extends Component{
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
                <NavLink exact to="/primary">Total dropouts in regions</NavLink >               
                <NavLink exact to="/primary/gender">Male / Female dropouts in region</NavLink>
                <NavLink exact to="/primary/district">total dropouts in districts</NavLink>
            </div>  
            <DistrictChart data={data} />           
            </Menu> 

            </div>

        )
    }
}
export default DistrictPrimaryChart;