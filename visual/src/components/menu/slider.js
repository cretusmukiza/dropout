import React,{Component} from 'react'
import StepRangeSlider from 'react-step-range-slider'
class  Slider extends Component{
  render(){
    const range = [
      { value: 2012, step: 1 }, // acts as min value     
      { value: 2017 } // acts as max value
    ]
    return(
      <StepRangeSlider 
        value={2013} 
        range={range} 
        onChange={value => console.log(value)}
      />
    )
  }
} 
export default Slider