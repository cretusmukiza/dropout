import React,{Component} from 'react';
import {Chart} from 'react-google-charts';
import _ from 'lodash';
import '../chart/chart.css';
class DistrictChart extends Component{
    constructor(props){
        super(props);
        this.state={
            region:"",
            data:[],
            width:"100%",
            regions:[],
            year: null
        }
        this.handleRegion=this.handleRegion.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.filterRegion=this.filterRegion.bind(this);
    }
    handleRegion(event){
        event.preventDefault()
        this.filterRegion(this.state.region, this.state.year)
    }
    handleChange(event){
        event.preventDefault()
        this.setState({[event.target.name]: event.target.value})                
    }
    filterRegion(index,year){
        console.log(index,year)
        console.log(this.props.data)
        const selectedRegion=this.props.data.filter((region)=>{
            return (region.region=== index || region.region==="REGION") && 
            (region.year === year || region.year ==="YEAR" || region.year === parseInt(year))
        })
        console.log(selectedRegion)
    
        const graph=selectedRegion.map((regions)=>{
            const result=_.pick(regions,['council','enrolment_total','dropout_total']);
         
            return  result; 
        } 
        
        )
        console.log(graph)
        var reducedUsers = _.reduce(graph, function (result, user) {
            
            (result[user.council] || (result[user.council] = [])).push(user);
        
      
        return result;
         }, {});   
        
        var finalUser=_.map(reducedUsers).map((user,index)=>{
            const key=user[0].council;            
            const sum=user.map((result)=>{
                return result.enrolment_total
            })
            const sum1=user.map((result)=>{
                return result.dropout_total
            })
            var regionSum=0;
            var dropoutSum=0;
            for(let i=0; i<sum.length;i++){ 
                if(isNaN(sum[i])){
                    regionSum=sum[i];
                }
                else{
                    regionSum+=Number(sum[i]);
                }

            }
            for(let i=0; i<sum1.length;i++){ 
                if(isNaN(sum1[i])){
                    dropoutSum=sum1[i];
                }
                else{
                    dropoutSum+=Number(sum1[i]);
                }

            }
            var percent=isNaN(dropoutSum) || isNaN(regionSum)?"Percentage dropout":((dropoutSum/regionSum)*100)
            return [key,regionSum,dropoutSum,percent];
        } )
        console.log(finalUser)
        const width=(finalUser.length>15)?"180%":"100%";
        this.setState({
            data:finalUser,
            width:width,
            
        });

    }
 
  
    render(){
        const {year,region} = this.state
        const width=window.innerWidth       
        var screenWidth="100%";
        var screeHeight="470px"  
        if(width<600){
         screenWidth="90%";
         screeHeight="100%"  
        } 
        const years=this.props.data.filter((year)=>(
            year.year !=="YEAR"          
        ))
        const yearList = years.map((year)=>year.year)
        const regions=this.props.data.filter((region)=>(
            region.region !=="REGION"       
        ))
        const regionList = regions.map((region)=>region.region)
        const linedata=_.sortedUniq(regionList);
        const yeardata=_.sortedUniq(yearList);
        console.log(this.state.data)
        
       
            return(
                <div>
                 <div id="select" >
                 <form style={{width:"40%",display:"flex",justifyContent:"space-between"}}>
                        <select name="region" onChange={this.handleChange} defaultValue={region}>
                            <option  selected >Select region</option>
                        {
                            linedata.map((line,index)=>(
                                <option key={index}>{line}</option>
                            ))
                        }
                        </select> 
                        <select name="year" onChange={this.handleChange} defaultValue={year}>
                        <option  selected>Select year</option>
                        {
                            yeardata.map((line,index)=>(
                                <option  key={index}>{line}</option>
                            ))
                        }
                        </select> 
                        <button onClick={this.handleRegion}   type="submit">Refresh</button>
                 </form>
                </div> 
                {
                    (this.state.data.length > 0)?
                    <div className={"my-pretty-chart-container"}>           
                    <Chart
                        width={screenWidth}
                        height={screeHeight}
                        chartType="BubbleChart"
                        loader={<div>Loading Chart</div>}
                        data={
                            this.state.data
                        }
                        options={{
                        title: `Dropout in  districts of ${this.state.region} region in ${year}`,
                        hAxis: { title: 'Total enrollment' },
                        vAxis: { title: 'Total dropout' },   
                        colorAxis: { colors: ['#29B6F6','#039BE5', '#0091EA'] },
                        chartArea: { width: '80%', height: '250' },                 
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />             
                    </div>: ''
                }                
              
             </div>                  
            )      
    }
}
export default DistrictChart;