import { useState, useEffect } from 'react';

const useSalesData = (dataType) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch sales data from backend API
    fetch('http://acdassanayake.me:8080/api/v1/getsales')
      .then((response) => response.json())
      .then((salesData) => {
        // Process the sales data based on the dataType parameter
        const processedData = dataType === 'monthly' ? processMonthlyData(salesData) : processDailyData(salesData);

        setData(processedData);
      })
      .catch((error) => console.error('Error fetching sales data:', error));
  }, [dataType]);

  // Process monthly data
  const processMonthlyData = (salesData) => {
    const groupedData = salesData.reduce((result, item) => {
      const date = new Date(item.timestamp);
      const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (result[key]) {
        result[key].amount += parseInt(item.totalPrice);
      } else {
        result[key] = {
          month: month.toString(),
          year: year.toString(),
          amount: parseInt(item.totalPrice),
        };
      }
      return result;
    }, {});

    return Object.values(groupedData);
  };

  // Process daily data
  const processDailyData = (salesData) => {
    const groupedData = salesData.reduce((result, item) => {
      const date = item.timestamp.split(',')[0].trim();
      if (result[date]) {
        result[date].amount += parseInt(item.totalPrice);
      } else {
        result[date] = {
          date,
          amount: parseInt(item.totalPrice),
        };
      }
      return result;
    }, {});

    return Object.values(groupedData);
  };

  return data;
};

export default useSalesData;
