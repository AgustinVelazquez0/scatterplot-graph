import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Tooltip from "./Tooltip";

const ScatterPlot = () => {
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    info: "",
    dataYear: 0,
  });

  const svgRef = useRef();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    )
      .then((response) => response.json())
      .then((dataset) => {
        dataset.forEach((d) => {
          const parsedTime = d.Time.split(":");
          d.timeInSeconds =
            parseInt(parsedTime[0]) * 60 + parseInt(parsedTime[1]);
        });

        setData(dataset);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 800;
    const height = 500;
    const padding = 60;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year - 1),
        d3.max(data, (d) => d.Year + 1),
      ])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => new Date(0, 0, 0, 0, 0, d.timeInSeconds)),
        d3.max(data, (d) => new Date(0, 0, 0, 0, 0, d.timeInSeconds)),
      ])
      .range([padding, height - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.selectAll("*").remove();

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height - padding})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(new Date(0, 0, 0, 0, 0, d.timeInSeconds)))
      .attr("r", 5)
      .attr("fill", (d) => (d.Doping ? "red" : "blue"))
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => new Date(0, 0, 0, 0, 0, d.timeInSeconds))

      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          x: event.pageX,
          y: event.pageY,
          info: `${d.Name} (${d.Nationality})<br/>
                 <strong>Año:</strong> ${d.Year} <br/>
                 <strong>Tiempo:</strong> ${d.Time} <br/>
                 ${
                   d.Doping
                     ? `<strong>Doping:</strong> ${d.Doping}`
                     : "Sin acusaciones de dopaje"
                 }`,
          dataYear: d.Year,
        });
      })
      .on("mouseout", () => setTooltip({ visible: false }));

    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", padding / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Doping in Professional Cycling");
  }, [data]);

  return (
    <div className="chart-container">
      <h2 id="title">Doping in Professional Cycling</h2>
      <svg ref={svgRef}></svg>
      <Tooltip {...tooltip} />
    </div>
  );
};

export default ScatterPlot;
