import React,{PureComponent} from 'react';
import {
    BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';
import '../chart/chart';
import _ from 'lodash';
import axios from 'axios'
class RegionChart extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            data:[],
            year: null,
            viewData: null
        }
        this.handleChange=this.handleChange.bind(this);
        this.onDownload = this.onDownload.bind(this)
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
    onDownload(data,year){
        console.log(data)
        axios({
            method: 'post',
            url: 'https://dropouts.herokuapp.com/bar',
            responseType: 'blob',            
            data: {
                data:data,
                year: year
            }
        }).then((res)=>{
          const type = res.headers['content-type']
          const url = window.URL.createObjectURL(new Blob([res.data],{type: type, encoding: 'UTF-8'}))
          const link = document.createElement('a')
          link.href = url
          link.download = 'region.pdf'
          document.body.appendChild(link)
          link.click()
        }).catch((error)=>{
            console.log(error)
        })
    }
    
    render(){
        const {year} = this.state
        const graph=this.state.data.map((regions)=>{
            const result=_.pick(regions,['region','dropout_total']);
         
            return  result; 
        } 
        
        )
        var reducedUsers = _.reduce(graph, function (result, user) {
            
                (result[user.region] || (result[user.region] = [])).push(user);
            
          
            return result;
        }, {});
        console.log(reducedUsers)
        
        var finalUser=_.map(reducedUsers).map((user,index)=>{
            const key=user[0].region;            
            const sum=user.map((result)=>{
                return result.dropout_total
            })
            var regionSum=0;
            for(let i=0; i<sum.length;i++){ 
                if(isNaN(sum[i])){
                    regionSum=sum[i];
                }
                else{
                    regionSum+=Number(sum[i]);
                }

            }
            return {region:key, total_dropout: regionSum};
        } ) 
        const width=window.innerWidth
        var screenWidth=1000;
        var screeHeight=380
        if(width<600){
         screenWidth=400;
         screeHeight=400
        }

      
       
        console.log(reducedUsers);
        const years=this.props.data.filter((year)=>(
            year.year !=="YEAR"            
        ))
        const yearData = years.map((year)=>year.year)
        console.log(finalUser)
        const linedata=_.sortedUniq(yearData)
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
             <button onClick = {(event)=>{
                 event.preventDefault();
                 this.onDownload(finalUser,year)
             }}>Download Chart</button>
            </div>
            <h2>A graph of total dropout vs region in year {year}</h2>
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
                <Bar name="Total dropout" dataKey="total_dropout" fill="#0336ff" />
            </BarChart>
             </div>
        )
        
    }
}
export default RegionChart;