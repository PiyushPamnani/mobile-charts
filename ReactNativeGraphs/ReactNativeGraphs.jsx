import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Button, View, Image, Text} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {captureRef} from 'react-native-view-shot';

const sampleData = [1, 2, 3, 4, 5];

const generateData = () => {
  return sampleData.map((value, index) => ({
    value: Math.random() * 10,
  }));
};

const ReactNativeGraphs = ({graphsArr}) => {
  const [chartData, setChartData] = useState(
    Array.from(Array(graphsArr.length), () => generateData()),
  );
  const chartRefs = useRef(Array.from(Array(graphsArr.length), () => useRef()));

  const chartTypes = ['line', 'pie', 'bar', 'lineArea'];

  useEffect(() => {
    const data = [];
    for (let i = 0; i < graphsArr.length; i++) {
      data.push(generateData());
    }
    setChartData(data);
  }, [graphsArr]);

  const generatePdf = async () => {
    const pdfPages = [];
    const chartsPerPage = 4;

    for (let i = 0; i < graphsArr.length; i += chartsPerPage) {
      const pageCharts = graphsArr.slice(i, i + chartsPerPage);

      const headerHtml = `
          <div class="header">
            <div>Report Date: ${new Date().toLocaleDateString()}</div>
          </div>
        `;

      const footerHtml = `
          <div class="footer">
            <a href="https://example.com">Click here for more information</a>
          </div>
        `;

      let pageHtml = `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  padding: 20px;
                }
                .chart-container {
                  width: 100%;
                }
                .chart-img {
                  width: 100%;
                  height: auto;
                  margin-bottom: 20px;
                }
                .header, .footer {
                  width: 100%;
                  text-align: center;
                }
                .footer a {
                  color: blue;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              ${headerHtml}
              <div class="container">
        `;

      for (let j = 0; j < pageCharts.length; j++) {
        const chartIndex = pageCharts[j];
        const chartRef = chartRefs.current[chartIndex];
        if (chartRef.current) {
          const chartContainerRef = await captureRef(chartRef.current, {
            format: 'png',
            quality: 0.8,
          });
          pageHtml += `<div class="chart-container">
          <p>Chart ${chartIndex + 1}</p>
          <Image src="${chartContainerRef}" class="chart-img" />
          </div>`;
        }
      }

      pageHtml += `
              </div>
              ${footerHtml}
            </body>
          </html>
        `;

      pdfPages.push(pageHtml);
    }

    const options = {
      html: pdfPages.join('<div style="page-break-after:always;"></div>'),
      fileName: 'mobile-charts',
      directory: 'Documents',
    };

    const pdf = await RNHTMLtoPDF.convert(options);
    console.log(pdf.filePath);
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <ScrollView>
        {graphsArr.map((n, index) => (
          <View key={n} collapsable={false} ref={chartRefs.current[index]}>
            <Text>Chart {n + 1}</Text>
            {chartTypes[index % chartTypes.length] === 'line' && (
              <LineChart data={chartData[index]} />
            )}
            {chartTypes[index % chartTypes.length] === 'pie' && (
              <PieChart data={chartData[index]} />
            )}
            {chartTypes[index % chartTypes.length] === 'bar' && (
              <BarChart data={chartData[index]} />
            )}
            {chartTypes[index % chartTypes.length] === 'lineArea' && (
              <LineChart data={chartData[index]} areaChart />
            )}
          </View>
        ))}
        <Button title="Generate PDF" onPress={generatePdf} />
      </ScrollView>
    </View>
  );
};

export default ReactNativeGraphs;
