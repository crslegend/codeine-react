import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import {
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ payload, active, category }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#437FC7",
          padding: "5px 10px",
          color: "#FFFFFF",
          opacity: 0.9,
          borderRadius: "5px",
        }}
      >
        <Typography variant="subtitle1">
          {payload[0].payload.category
            ? `${payload[0].payload.category} : ${payload[0].value}`
            : `${payload[0].payload.name} : ${payload[0].value}`}
        </Typography>
      </div>
    );
  }

  return null;
};

const SkillSetChart = ({ data, type }) => {
  const [dataList, setDataList] = useState([]);

  const handleSetRadarData = (statsData) => {
    let list = [];
    if (type === "skill") {
      list.push({
        category: "UI/UX",
        display: "UI/UX",
        points: statsData.UI.toFixed(1),
      });
      list.push({
        category: "Frontend",
        display: "FE",
        points: statsData.FE.toFixed(1),
      });
      list.push({
        category: "Backend",
        display: "BE",
        points: statsData.BE.toFixed(1),
      });
      list.push({
        category: "Security",
        display: "SEC",
        points: statsData.SEC.toFixed(1),
      });
      list.push({
        category: "Database Administration",
        display: "DB",
        points: statsData.DB.toFixed(1),
      });

      list.push({
        category: "Machine Learning",
        display: "ML",
        points: statsData.ML.toFixed(1),
      });
    } else if (type === "language") {
      list.push({
        category: "Java",
        display: "Java",
        points: statsData.JAVA.toFixed(1),
      });
      list.push({
        category: "C++",
        display: "C++",
        points: statsData.CPP.toFixed(1),
      });
      list.push({
        category: "C#",
        display: "C#",
        points: statsData.CS.toFixed(1),
      });
      list.push({
        category: "CSS",
        display: "CSS",
        points: statsData.CSS.toFixed(1),
      });
      list.push({
        category: "HTML",
        display: "HTML",
        points: statsData.HTML.toFixed(1),
      });

      list.push({
        category: "Javascript",
        display: "JS",
        points: statsData.JS.toFixed(1),
      });
      list.push({
        category: "Python",
        display: "Py",
        points: statsData.PY.toFixed(1),
      });
      list.push({
        category: "Ruby",
        display: "Ruby",
        points: statsData.RUBY.toFixed(1),
      });
    }

    setDataList(list);
  };

  useEffect(() => {
    handleSetRadarData(data && data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ResponsiveContainer width="100%" height={310}>
        <RadarChart
          width="100%"
          height="100%"
          style={{
            paddingBottom: "10px",
          }}
          data={dataList && dataList}
        >
          <PolarGrid stroke="#050404" />
          <PolarAngleAxis tickLine={false} dataKey="display" stroke="#050404" />
          <PolarRadiusAxis stroke="#050404" />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Category"
            dataKey="points"
            stroke="#C74343"
            fill="#C74343"
            fillOpacity={0.8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillSetChart;
