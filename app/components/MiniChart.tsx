import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniChartProps {
  trend: "increment" | "decrement" | "no change";
  data: Array<{ value: number }>;
}

/**
 * MiniChart Component
 *
 * A small sparkline chart for StatsCard that shows trend data
 * Colors based on trend: Primary (teal) for increment, Pink for decrement or no change
 *
 * @param trend - The trend direction
 * @param data - Array of data points with values
 */
const MiniChart = ({ trend, data }: MiniChartProps) => {
  // Determine color based on trend
  const getColor = () => {
    switch (trend) {
      case "increment":
        return "rgb(14, 165, 164)"; // Primary teal - ascending
      case "decrement":
        return "rgb(255, 107, 107)"; // Pink - descending
      case "no change":
        return "rgb(255, 107, 107)"; // Pink - no change also shows descending
      default:
        return "rgb(107, 114, 128)"; // Gray
    }
  };

  // For "no change", show descending data instead of flat
  const getChartData = () => {
    if (trend === "no change") {
      // Show descending trend for no change
      return Array.from({ length: 12 }, (_, i) => ({
        value: Math.max(10 - i * 0.8, 0), // Descending from 10 to 0
      }));
    }
    return data;
  };

  const color = getColor();
  const chartData = getChartData();

  return (
    <ResponsiveContainer width={120} height={60}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniChart;
