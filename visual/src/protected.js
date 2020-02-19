import React,{Component} from 'react'
import {Route,Redirect} from 'react-router-dom';
class ProtectedRoute extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() {
      const { component: Component, ...props } = this.props;
      const auth=localStorage.getItem('usertoken');
      var state = true;
      if(auth){
        state=true;
      }
    
  
      return (
        <Route 
          {...props} 
          render={props => (
            state?
              <Component {...props} /> :
              <Redirect to='/' />
          )} 
        /> 

      )
    }
  }
  export default ProtectedRoute;