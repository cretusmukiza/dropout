import React from "react";
import Highcharts from "highcharts";
import HighChartsReact from "highcharts-react-official";
import { mapDataTanzania } from "./mapTanzania";
import _ from "lodash";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
require("highcharts/modules/map")(Highcharts);
window.Highcharts = Highcharts;
const range = {
              0: 2012,
              20: 2013,
              40: 2014,
              60: 2015,
              80: 2016,
              100: 2017
            }
export default class MapSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      year: 2012,
      slider: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value) {
    const yearData = this.props.data.filter(
      year => parseInt(year.year) === parseInt(range[value])
    );
    const graph = yearData.map(regions => {
      const result = _.pick(regions, ["region", "dropout_total"]);

      return result;
    });
    var reducedUsers = _.reduce(
      graph,
      function(result, user) {
        (result[user.region] || (result[user.region] = [])).push(user);

        return result;
      },
      {}
    );
    console.log(reducedUsers);

    var finalUser = _.map(reducedUsers).map((user, index) => {
      const key = user[0].region;
      const sum = user.map(result => {
        return result.dropout_total;
      });
      var regionSum = 0;
      for (let i = 0; i < sum.length; i++) {
        if (isNaN(sum[i])) {
          regionSum = sum[i];
        } else {
          regionSum += Number(sum[i]);
        }
      }
      return [key, regionSum];
    });
    this.setState({
      data: finalUser,
      year: range[value],
      slider: value
    });
  }
  componentDidMount() {
    this.handleChange(0);
  }
  render() {
    const { data, year,slider } = this.state;
    const options = {
      title: {
        text: `Map of dropouts in ${this.props.school} in year ${year} `
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom"
        }
      },

      colorAxis: {
        min: 0
      },

      series: [
        {
          data: data,
          name: "Total dropout",
          mapData: mapDataTanzania,
          states: {
            hover: {
              color: "#BADA55"
            }
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}"
          }
        }
      ]
    };
    return (
      <div className="map-content">
        <HighChartsReact
          options={options}
          constructorType={"mapChart"}
          highcharts={Highcharts}
        />
        <div className="map-footer">
          <Slider
            min={0}
            defaultValue={slider}
            marks={range}
            step={20}
            dots={true}
            onChange={(value)=>this.handleChange(value)}
          />
        </div>
      </div>
    );
  }
}
