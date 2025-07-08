import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface LoadVolumeChartProps {
  data: {
    dates: string[];
    counts: number[];
  };
  className?: string;
}

const LoadVolumeChart: React.FC<LoadVolumeChartProps> = ({ data, className = '' }) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%',
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#10B981', '#10B981', '#10B981', '#10B981', '#10B981', '#10B981', '#10B981'],
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toString();
      },
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#404040']
      },
      offsetY: -20
    },
    xaxis: {
      categories: data.dates,
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
        },
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
      min: 0,
      max: Math.max(...data.counts) * 1.2 // Add 20% headroom
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val.toString() + ' loads';
        }
      }
    },
    legend: {
      show: false
    }
  };

  const series = [{
    name: 'Loads',
    data: data.counts
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

export default LoadVolumeChart;