import React,{Component} from 'react';
import {Chart} from 'react-google-charts';
import _ from 'lodash';
import '../src/components/chart/chart.css';
class SummaryMap extends Component{
    constructor(props){
        super(props);
        this.state={
             width:"180%"
        }   
    }
 
  
    render(){

        const width=window.innerWidth
        const graph=this.props.data.map((regions)=>{
            const result=_.pick(regions,['death_total','pregnancy_total','truancy_total','indiscipline_total']);
         
            return  result; 
        } 
        
        )
        var death_total=0;
        var pregnancy_total=0;
        var truancy_total=0;
        var indiscipline_total=0;
        for(let i=0;i<graph.length;i++){
            if(isNaN(graph[i].death_total)){
                continue;
            }
            else{
                death_total+=parseInt(graph[i].death_total);
                pregnancy_total+=parseInt(graph[i].pregnancy_total);
                truancy_total+=parseInt(graph[i].truancy_total);
                indiscipline_total+=parseInt(graph[i].indiscipline_total);
            }

        }
        const finaluser=[
            ["dropout reason","total dropouts"],
            ["death",death_total],
            ["truancy",truancy_total],
            ["indiscipline",indiscipline_total],
            ['pregnacny',pregnancy_total]
        ];
        console.log(finaluser);
        
        var screenWidth="99.83%%";
        var screeHeight="99.83%"  
        if(width<600){
         screenWidth="100%";
         screeHeight="100%"  
        }

      
        return(               
               
            <Chart
                width={screenWidth}
                height={screeHeight}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                 data={
                    finaluser
                }
                options={{
                title:this.props.title,
                pieHole:0.3,
                is3D:false
                 }}
                rootProps={{ 'data-testid': '1' }}
            />
      
           
       
        )
        
     
    }
}
export default SummaryMap;