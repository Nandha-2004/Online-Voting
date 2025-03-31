import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../helper";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/getCandidate`)
      .then((response) => {
        const candidates = response.data.candidate || [];

        // Process data to group by party
        const partyVotes = candidates.reduce((acc, candidate) => {
          if (candidate && candidate.party) {
            const partyIndex = acc.findIndex((item) => item.party === candidate.party);
            if (partyIndex > -1) {
              acc[partyIndex].votes += candidate.votes || 0;
            } else {
              acc.push({ party: candidate.party, votes: candidate.votes || 0 });
            }
          }
          return acc;
        }, []);

        setData(partyVotes);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: colors.grey[100] } },
          legend: { text: { fill: colors.grey[100] } },
          ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100] } },
        },
        legends: { text: { fill: colors.grey[100] } },
      }}
      keys={["votes"]}
      indexBy="party"
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      padding={0.5}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "dark2" }}
      borderColor={{ from: "color", modifiers: [["darker", "1.6"]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Parties",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 8,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Votes",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 50,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [{ on: "hover", style: { itemOpacity: 1 } }],
        },
      ]}
      role="application"
      barAriaLabel={(e) => `${e.id}: ${e.formattedValue} votes for party: ${e.indexValue}`}
    />
  );
};

export default BarChart;
