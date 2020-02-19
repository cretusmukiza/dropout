import React, { Component } from "react";
import Menu from "../menu/menu";
import "./upload.css";
import axios from "axios";
import DistrictChart from "./districtchart";
import GenderChart from "./genderchart";
import RegionChart from "./chart";
import {Redirect} from 'react-router-dom'
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      region: "",
      displayError: false,
      error: "",
      status: false,
      districts: [],
      file: null,
      data: []
    };
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleGraph = this.onHandleGraph.bind(this);
    this.download = this.download.bind(this)
  }
  onHandleChange(event) {
    this.setState({
      file: event.target.files[0],
      displayError: false
    });
  }
  download(event){
    event.preventDefault()
      axios({
          method: 'get',
          url: 'https://dropouts.herokuapp.com/template',
          responseType: 'blob'
      }).then((res)=>{
        const type = res.headers['content-type']
        const url = window.URL.createObjectURL(new Blob([res.data],{type: type, encoding: 'UTF-8'}))
        const link = document.createElement('a')
        link.href = url
        link.download = 'template.csv'
        document.body.appendChild(link)
        link.click()
      }).catch((error)=>{
          console.log(error)
      })
  }
  onHandleGraph(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  onHandleSubmit(event) {
    if (this.state.file) {
      event.preventDefault();
      const formData = new FormData();
      formData.append("dropouts", this.state.file);
      axios({
        method: "post",
        data: formData,
        url: "https://dropouts.herokuapp.com/dropouts"
      })
        .then(res => {
          if (res.data) {
            this.setState({
              data: res.data
            });
          } else {
            this.setState({
              error: "Request failed",
              displayError: true
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      this.setState({
        error: "Please upload file",
        displayError: true
      });
    }
  }
  render() {
    const { data, graph } = this.state;
    const token = localStorage.getItem('usertoken1')
    if(!token){
      return(
        <Redirect to="/login" />
      )
    }
    else if (this.state.data.length > 0) {
      return (
        <Menu>
          <div id="select">
            <select
              name="graph"
              onChange={this.onHandleGraph}
              defaultValue={graph}
            >
              <option disabled selected>
                Select graph
              </option>
              <option value="region"> Total dropouts vs region</option>
              <option value="district">
                {" "}
                Total enrolment vs Total dropouts in districts
              </option>
              <option value="gender"> Male / Female dropout vs region</option>
            </select>
          </div>
          {graph === "region" ? <RegionChart data={data} /> : ""}
          {graph === "district" ? (
            <DistrictChart
              data={[
                {
                  region: "REGION",
                  council: "COUNCIL",
                  year: "YEAR",
                  enrolment_male: 29791,
                  enrolment_female: 31990,
                  enrolment_total: "ENROLMENT TOTAL",
                  dropout_male: 535,
                  dropout_female: 387,
                  dropout_total: "DROPOUT TOTAL"
                },
                ...data
              ]}
            />
          ) : (
            ""
          )}
          {graph === "gender" ? <GenderChart data={data} /> : ""}
        </Menu>
      );
    }
    else return (
      <div className="App">
        <Menu>
          <form className="upload-form" enctype="multipart/form-data">
            <h2>Upload your data</h2>

            <div className="upload-input">
              <input
                type="file"
                name="upload"
                placeholder="Number of female students dead"
                onChange={this.onHandleChange}
              />
            </div>

            <div
              className="upload-input"
              style={{
                display: `${this.state.displayError ? "flex" : "none"}`
              }}
            >
              <p>{this.state.error}</p>
            </div>
            <div className="upload-input">
              <input
                type="submit "
                value="upload data"
                onClick={this.onHandleSubmit}
                className="submit"
              />
              <button
                onClick = {this.download}
                style={{
                  marginLeft: "10.1rem"
                }}
              >
                Download Template
              </button>
            </div>
          </form>
        </Menu>
      </div>
    );
  }
}
export default Upload;
