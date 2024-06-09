"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3-shape";

export interface PieChartData {
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  maxLegendItems?: number;
  maxPieChartItems?: number;
  innerRadius?: number;
}

type PieChartArc = PieArcDatum<PieChartData>;

export const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 500,
  height = 500,
  maxLegendItems = 5,
  maxPieChartItems = 10,
  innerRadius = 0,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const legendX = width + 20;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let sortedData = data.slice().sort((a, b) => b.value - a.value);
    sortedData = sortedData.slice(0, maxPieChartItems);

    const pie = d3.pie<PieChartData>().value((d) => d.value);
    const pieData = pie(sortedData);

    const arc = d3
      .arc<PieChartArc>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("path")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d: PieChartArc) => color(d.data.label));

    const legendData = pieData.slice(0, maxLegendItems);
    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(legendData)
      .join("g")
      .attr("transform", (d, i) => `translate(${legendX}, ${i * 20 + 10})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", -7.5)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d: PieChartArc) => color(d.data.label));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 0)
      .text((d: PieChartArc) => d.data.label);
  }, [data, width, height, maxLegendItems, innerRadius]);

  return <svg ref={svgRef} width={width + 120} height={height} />;
};
