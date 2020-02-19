import React,{PureComponent} from 'react';
import {
    BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import  '../chart/chart.css';
import _ from 'lodash';
class GenderChart extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            region:"",
            data:[],
            width:"180%",
            selected:null,
            year: null
        }
        this.handleChange=this.handleChange.bind(this);
        }
        handleChange(event){
            event.preventDefault()
            console.log(event.target.value)
            this.setState({year: event.target.value})         
            if(event.target.value !== null){
                const data=this.props.data.filter((year)=>(
                   (parseInt(year.year) === parseInt(event.target.value)) || (year.year==="YEAR")
                ))
                console.log(data)
                this.setState({
                    data:data
                })
            }            
        }
        componentDidMount(){
            this.setState({
                data:this.props.data
            })
        }
       render(){
        console.log(this.props.data)
        const {year} = this.state
        const graph=this.state.data.map((regions)=>{
            const result=_.pick(regions,['region','dropout_male','dropout_female']);
         
            return  result; 
        } 
        
        )
       
        var reducedUsers = _.reduce(graph, function (result, user) {
            
                (result[user.region] || (result[user.region] = [])).push(user);
            
          
            return result;
        }, {});
     
        var finalUser=_.map(reducedUsers).map((user,index)=>{
            const key=user[0].region;            
            const sum_female=user.map((result)=>{
                return result.dropout_female
            })
            const sum_male=user.map((result)=>{
                return result.dropout_male
            })
           
            var female_sum=0;
            var male_sum=0
            for(let i=0; i<sum_female.length;i++){ 
                if(isNaN(sum_female[i])){
                 female_sum=sum_female[i];
                }
                else{
                 female_sum+=Number(sum_female[i]);
                }

            }
            for(let i=0; i<sum_male.length;i++){ 
                if(isNaN(sum_male[i])){
                 male_sum=sum_male[i];
                }
                else{
                 male_sum+=Number(sum_male[i]);
                }

            }
            return {region:key ,dropout_female:female_sum,dropout_male:male_sum};
        } ) 
        const years=this.props.data.filter((year)=>(
            year.year !=="YEAR"            
        ))
        const yearList = years.map((year)=>year.year)
        console.log(finalUser)
        const linedata=_.sortedUniq(yearList);      
        const width=window.innerWidth
        var screenWidth=1000;
        var screeHeight=380
        if(width<600){
         screenWidth=400;
         screeHeight=400
        }

        if(!year){
            return(
                <div id="select" >
                <select name="year" onChange={this.handleChange}>
                    <option  disabled selected>Select year</option>
                    {
                           linedata.map((line,index)=>(
                               <option value={line} key={index}>{line}</option>
                           ))
                    }
                 </select> 
                 <h4>No data selected</h4>
                </div>
                
            )
        }
        return(
            <div>
            <div id="select" >
            <select name="year" onChange={this.handleChange} defaultValue={year}>
                <option  disabled selected>Select year</option>
                {
                       linedata.map((line,index)=>(
                           <option value={line} key={index}>{line}</option>
                       ))
                }
             </select> 
            </div>
            <h2>A graph of male and female dropout vs region in year {year}</h2>
            <BarChart
                width={screenWidth}
                height={screeHeight}
                data={finalUser}
                margin={{
                top: 5, right: 30, left: 20, bottom: 5,
                }}
             >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend margin = {{bottom: -10}} />
                <Bar name="Dropout male" dataKey="dropout_male" fill="#0336ff" />
                <Bar name="Dropout female" dataKey="dropout_female" fill="#00B8D4" />
            </BarChart>
             </div>
        )
        
    }
    }

export default GenderChart;