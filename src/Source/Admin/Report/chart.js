import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from '../title';
import { EventTracker } from '@devexpress/dx-react-chart';
import useSalesData from './useSalesData'; // Import the custom hook

const monthLabels = [
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];

const MonthlySales = () => {
  const theme = useTheme();
  const data = useSalesData('monthly');

  // Group data by month and calculate total sales for each month
  const monthlyData = data.reduce((result, item) => {
    const month = parseInt(item.month) - 1; // Convert month to zero-indexed
    if (result[month]) {
      result[month].amount += item.amount;
    } else {
      result[month] = {
        month: month,
        amount: item.amount,
      };
    }
    return result;
  }, []);

  // Format data for the LineChart
  const formattedData = monthLabels.map((label, index) => ({
    month: label,
    amount: monthlyData[index]?.amount || 0,
  }));

  return (
    <React.Fragment>
      <Title>Monthly Sales</Title>
      <ResponsiveContainer width="100%" height={175}>
        <LineChart
          data={formattedData} // Use the formatted data
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="month"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales (Rs.)
            </Label>
          </YAxis>
          <EventTracker />
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};


const Chart = () => {
  const theme = useTheme();
  const data = useSalesData('daily');
  
  return (
    <React.Fragment>
      <Title>Sales for Each Day in the Month</Title>
      <ResponsiveContainer width="100%" height={175}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Sales (Rs.)
            </Label>
          </YAxis>
          <EventTracker />
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export { Chart, MonthlySales };
