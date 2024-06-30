import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  Button,
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';
import {captureRef} from 'react-native-view-shot';
import Navbar from '../Navbar/Navbar';
import RNFS from 'react-native-fs';
import {PDFDocument, rgb, PageSizes} from 'pdf-lib';
import analytics from '@react-native-firebase/analytics';

const sampleData = [1, 2, 3, 4, 5];

const generateData = () => {
  return sampleData.map(() => ({
    value: Math.random() * 10,
  }));
};

const chartTypes = ['line', 'pie', 'bar', 'lineArea'];

const ReactNativeGraphs = ({route, navigation}) => {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollOffset, setLastScrollOffset] = useState(0);
  const [graphsArr, setGraphsArr] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartImages, setChartImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfURI, setPdfURI] = useState(null);
  const chartRefs = useRef([]);
  const number = route?.params?.chartNumber;

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ]);
          if (
            granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('You can use the storage');
          } else {
            console.log('Storage permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const newGraphsArr = Array.from(
      {length: parseInt(number, 10)},
      (_, i) => i,
    );
    setGraphsArr(newGraphsArr);
  }, [number]);

  useEffect(() => {
    const data = graphsArr.map((_, i) => ({
      type: chartTypes[i % chartTypes.length],
      data: generateData(),
    }));
    setChartData(data);
  }, [graphsArr]);

  const handleScroll = event => {
    const currentScrollOffset = event.nativeEvent.contentOffset.y;
    setNavbarVisible(currentScrollOffset < lastScrollOffset);
    setLastScrollOffset(currentScrollOffset);
  };

  const captureChartImage = async index => {
    if (chartRefs.current[index]) {
      const chartContainerRef = await captureRef(chartRefs.current[index], {
        format: 'png',
        quality: 0.8,
      });
      setChartImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = chartContainerRef;
        return newImages;
      });
    }
  };

  const generatePdf = async () => {
    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const chartsPerRow = 2;
      const chartsPerPage = 4;
      const margin = 50;
      const imageWidth = 200;
      const imageHeight = 200;
      const xOffset =
        (PageSizes.A4[0] -
          chartsPerRow * imageWidth -
          (chartsPerRow - 1) * margin) /
        2;
      const yOffset = PageSizes.A4[1] - 100;

      for (let i = 0; i < graphsArr.length; i += chartsPerPage) {
        let page = pdfDoc.addPage(PageSizes.A4);
        page.drawText(`Report Date: ${new Date().toLocaleDateString()}`, {
          x: margin,
          y: PageSizes.A4[1] - margin,
          size: 20,
          color: rgb(0, 0, 0),
        });

        const pageCharts = graphsArr.slice(i, i + chartsPerPage);
        for (let j = 0; j < pageCharts.length; j++) {
          const chartIndex = pageCharts[j];
          if (chartImages[chartIndex]) {
            const pngImageBytes = await RNFS.readFile(
              chartImages[chartIndex],
              'base64',
            );
            const pngImage = await pdfDoc.embedPng(pngImageBytes);

            const xPosition =
              xOffset + (j % chartsPerRow) * (imageWidth + margin);
            const yPosition =
              yOffset -
              Math.floor(j / chartsPerRow) * (imageHeight + margin) -
              200;

            page.drawImage(pngImage, {
              x: xPosition,
              y: yPosition,
              width: imageWidth,
              height: imageHeight,
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.saveAsBase64();
      const pdfPath = `${RNFS.DocumentDirectoryPath}/graphs.pdf`;
      await RNFS.writeFile(pdfPath, pdfBytes, 'base64');
      await analytics().logEvent('pdf_generated', {
        pdfPath,
      });
      setPdfURI(`file://${pdfPath}`);
      console.log(pdfURI);
      Alert.alert(`PDF saved at: ${pdfPath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (pdfURI) navigation.navigate('PdfScreen', {pdfURI});
  }, [pdfURI]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <ScrollView onScroll={handleScroll}>
        {graphsArr.map((n, index) => (
          <View
            key={n}
            collapsable={false}
            ref={ref => (chartRefs.current[index] = ref)}
            onLayout={() => captureChartImage(index)}
            style={{marginBottom: 20}}>
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
        <Button
          title={loading ? 'Preparing PDF' : 'Download PDF'}
          onPress={generatePdf}
          disabled={loading}
        />
      </ScrollView>
      <Navbar navbarVisible={navbarVisible} />
    </View>
  );
};

export default ReactNativeGraphs;
