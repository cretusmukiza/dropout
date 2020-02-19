import React,{Component} from 'react';
import '../login/login.css';
import {Link} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import axios from 'axios';
class Signup extends  Component{
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            confirm:'',
            error:"",
            displayError:false,
            status:false

        }
        this.onChange=this.onChange.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
    }
    onChange(event){
        event.preventDefault();
        this.setState({
            [event.target.name]:event.target.value
        });
    }
    onSubmit(event){
        event.preventDefault();
        const {email,password,confirm}=this.state;
        if(email==="" || password==="" || confirm===""){
            this.setState({
                error:"Please fill details",
                displayError:true
            })
        }
        else if(confirm!==password){
            this.setState({
                error:"Password do not match",
                displayError:true
            })
        }
        else{
            this.setState({
                error:"",
                displayError:false,
                status:true

            })
            axios.post('https://dropouts.herokuapp.com/registerUser',{
                email:email,
                password:password
            }).then((res)=>{ 
                console.log(res)               
                if(res.data){
                    this.setState({
                        status:false,
                        displayError:false
                    });
                    window.location.replace('/login')
                }
                else{
                    this.setState({
                        error:'Registration failed',
                        status:false,
                        displayError:true
                    })
                }
              
            }).catch(
                (error)=>{
                    console.log(error);
                }
            )
        }

    }
    render(){
        return(
            <div className="home">
            <div className="form">
                <h2>Create your Account</h2>
                <form  onSubmit={this.onSubmit}>
                    <input type="text" name="email" placeholder="Email address" onChange={this.onChange} 
                        value={this.state.email}
                    />
                    <input type="password" name="password" placeholder="Password" onChange={this.onChange}
                        value={this.state.password}
                    />
                    <input type="password" name="confirm" placeholder="Confirm" onChange={this.onChange}
                        value={this.state.confirm}
                    />
                    <input type="submit" value="Submit" />
                    <div className="errors" style={{
                        display:`${this.state.displayError?"flex":"none"}`
                    }}  >
                        {this.state.error}
                    </div>
                    <div className="status" style={{
                        display:`${this.state.status?"flex":"none"}`}}>
                        <Loader type="ThreeDots" color="#1389E7" height={80} width={80} />                    
                    </div>
                </form>
                
                <div className="form-footer">
                    <p>Have an account? <Link to="/">Login</Link></p>
                </div>
            </div>
            
            </div>

        )
    }
}
export default Signup;