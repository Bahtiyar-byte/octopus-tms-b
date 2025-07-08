import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface RevenueChartProps {
  data: {
    customer: string;
    revenue: number;
    color: string;
  }[];
  className?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, className = '' }) => {
  // Sort data by revenue in descending order
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);
  
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: sortedData.map(item => item.color),
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return '$' + val.toLocaleString();
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#404040']
      },
      offsetX: 30
    },
    xaxis: {
      categories: sortedData.map(item => item.customer),
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif'
        }
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return '$' + val.toLocaleString();
        }
      }
    },
    legend: {
      show: false
    }
  };

  const series = [{
    name: 'Revenue',
    data: sortedData.map(item => item.revenue)
  }];

  return (
    <div className={`w-full ${className}`}>
      <Chart
        options={options}
        series={series}
        type="bar"
        height="300"
      />
    </div>
  );
};

export default RevenueChart;