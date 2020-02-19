import React, { Component } from "react";
import Menu from "../menu/menu";
import {data as primary} from "../../primary";
import {data as secondary} from "../../secondary";
import {priData} from "../../region_map_primary";
import { secData } from "../../region_map_secondary";
import SummaryMap from "../../summary_map";
import MapSummary from "../map_summary";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="App">
        <Menu>
          <div className="map">
            <div className="dropout-map">
              <div className="map-header" />    
                <MapSummary data={priData}
                  school = "primary school"
                />           
              <div className="map-graph">
                <SummaryMap
                  data={primary}
                  title="Reason for dropouts in primary schools 2012 - 2017"
                />
              </div>
            </div>
            <div className="dropout-map">
              <div className="map-header" />      
                <MapSummary data={secData}
                  school = "secondary school"
                />              
              <div className="map-graph">
                <SummaryMap
                  data={secondary}
                  title="Reason for dropouts in secondary schools 2012 - 2017"
                />
              </div>
            </div>
          </div>
        </Menu>
      </div>
    );
  }
}
export default Home;
