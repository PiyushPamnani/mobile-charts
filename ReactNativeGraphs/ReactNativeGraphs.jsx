import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, Button, View, Image, Text} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {captureRef} from 'react-native-view-shot';
import Navbar from '../Navbar/Navbar';

const sampleData = [1, 2, 3, 4, 5];

const generateData = () => {
  return sampleData.map((value, index) => ({
    value: Math.random() * 10,
  }));
};

const chartTypes = ['line', 'pie', 'bar', 'lineArea'];

const ReactNativeGraphs = ({navigation, route}) => {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollOffset, setLastScrollOffset] = useState(0);
  const [graphsArr, setGraphsArr] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartImages, setChartImages] = useState([]);

  const chartRefs = useRef(Array.from({length: 10}, () => null));

  const number = route?.params?.chartNumber;

  useEffect(() => {
    const newGraphsArr = [];
    for (let i = 0; i < parseInt(number, 10); i++) {
      newGraphsArr.push(i);
    }
    setGraphsArr(newGraphsArr);
  }, [number]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < graphsArr.length; i++) {
      data.push({
        type: chartTypes[i % chartTypes.length],
        data: generateData(),
      });
    }
    setChartData(data);
  }, [graphsArr]);

  const handleScroll = event => {
    const currentScrollOffset = event.nativeEvent.contentOffset.y;
    const scrollUp = currentScrollOffset < lastScrollOffset;

    if (scrollUp) {
      setNavbarVisible(true);
    } else {
      setNavbarVisible(false);
    }

    setLastScrollOffset(currentScrollOffset);
  };

  const captureChartImage = async index => {
    if (chartRefs.current[index]) {
      const chartContainerRef = await captureRef(chartRefs.current[index], {
        format: 'png',
        quality: 0.8,
      });
      setChartImages(prevImages => [...prevImages, chartContainerRef]);
    }
  };

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
        if (chartImages[chartIndex]) {
          pageHtml += `
              <div class="chart-container">
                <p>Chart ${chartIndex + 1}</p>
                <img src="${chartImages[chartIndex]}" class="chart-img" />
              </div>
            `;
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
      <ScrollView onScroll={handleScroll}>
        {graphsArr.map((n, index) => (
          <View
            key={n}
            collapsable={false}
            ref={ref => (chartRefs.current[index] = ref)}
            onLayout={() => captureChartImage(index)}>
            <Text>Chart {n + 1}</Text>
            {chartData[index]?.type === 'line' && (
              <LineChart data={chartData[index]?.data} />
            )}
            {chartData[index]?.type === 'pie' && (
              <PieChart data={chartData[index]?.data} />
            )}
            {chartData[index]?.type === 'bar' && (
              <BarChart data={chartData[index]?.data} />
            )}
            {chartData[index]?.type === 'lineArea' && (
              <LineChart data={chartData[index]?.data} areaChart />
            )}
          </View>
        ))}
        <Button title="Generate PDF" onPress={generatePdf} />
      </ScrollView>
      <Navbar navbarVisible={navbarVisible} />
    </View>
  );
};

export default ReactNativeGraphs;
