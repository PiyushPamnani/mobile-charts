import React, {useRef} from 'react';
import {ScrollView, Button, View, Image, Text} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {captureRef} from 'react-native-view-shot';

const sampleData = [1, 2, 3, 4, 5];
const num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const App = () => {
  const generateData = () => {
    return sampleData.map((value, index) => ({
      value: Math.random() * 10,
    }));
  };

  // Create an array of refs for each LineChart
  const chartRefs = num.map(() => useRef());

  const generatePdf = async () => {
    const pdfPages = [];
    const chartsPerPage = 4;

    for (let i = 0; i < num.length; i += chartsPerPage) {
      const pageCharts = num.slice(i, i + chartsPerPage);

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
        const chartContainerRef = await captureRef(chartRefs[chartIndex], {
          format: 'png',
          quality: 0.8,
        });
        pageHtml += `<div class="chart-container">
        <p>Chart ${chartIndex + 1}</p>
        <Image src="${chartContainerRef}" class="chart-img" />
        </div>`;
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
    <ScrollView>
      {num.map((n, index) => (
        <View key={n} ref={chartRefs[index]} collapsable={false}>
          <Text>Chart {n + 1}</Text>
          <LineChart data={generateData()} />
        </View>
      ))}
      <Button title="Generate PDF" onPress={generatePdf} />
    </ScrollView>
  );
};

export default App;
