import React,{Component} from 'react';
import {Chart} from 'react-google-charts';
import '../chart/chart.css';
import _ from 'lodash';
class SchoolChart extends Component{
    constructor(props){
        super(props);
        this.state={
            region:"",
            data:[],
            width:"100%",
            regions:[]
        }
        this.handleRegion=this.handleRegion.bind(this);
        this.filterRegion=this.filterRegion.bind(this);
    }
    handleRegion(event){
        if(event.target.value!=="REGION"){
            this.setState({region:event.target.value})
        }
        this.filterRegion(event.target.value)
    }
    filterRegion(index){
        const selectedRegion=this.props.data.filter((region)=>(
            region.region===index || region.region==="REGION"
        ))
    
        const graph=selectedRegion.map((regions)=>{
            const result=_.pick(regions,['school','total_dropout']);
         
            return  result; 
        } 
        
        )    
        
        var finalUser=graph.map((user,index)=>{
            var dropouts=null;
            if(isNaN(user.total_dropout)){
                dropouts=user.total_dropout;
            }
            else{
                dropouts=parseInt(user.total_dropout);
            }
            
            const key=user.school;
            return [key,dropouts];
        } ) 
        const width=(finalUser.length>15)?"180%":"100%";
        this.setState({
            data:finalUser,
            width:width
        });

    }
    render(){
        const regions=this.props.data.map((region)=>{
            if(region.region !=="REGION"){
                return region.region
            }
           
        })

        const linedata=_.sortedUniq(regions);    
        console.log(this.state.width);
        const width=window.innerWidth
        var screenWidth="90%";
        var screeHeight="400px"  
        if(width<600){
         screenWidth="200%";
         screeHeight="400px"  
        }
        console.log(this.state.data);

        if(this.state.data.length>0){
        return(
            <div>
             <div id="select" >
            <select name="region" onChange={this.handleRegion}>
               {
                   linedata.map((line,index)=>(
                       <option  key={index}>{line}</option>
                   ))
               }
             </select> 
            </div>                 
            <div className={"my-pretty-chart-container"}>           
            <Chart
            width={screenWidth}
            height={screeHeight}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={this.state.data}
            options={{  
             // Material design options
             colors: ['#007dab', '#ffab91'],
            chart: {
            title: 'Total dropout vs Region',
            vAxis:{
                minValue:10,
                maxValue:100
            }
     
            },
            }}
            // For tests
            rootProps={{ 'data-testid': '6' }}
            />
            
              
     
            </div>
                </div>   
            
           

        
        )
        }
        else{
            return(
             <div>
                     
                   
             <div id="select">
                <select name="region" onChange={this.handleRegion}>
                <option disabled selected>Select region</option>
               {
                   linedata.map((line,index)=>(
                       <option key={index}>{line}</option>
                   ))
               }
            </select>          
            </div>

            </div>   
               
               
            )
        }
    }
}
export default SchoolChart;