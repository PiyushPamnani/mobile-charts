import React, {useEffect, useState} from 'react';
import {ScrollView, Button, View, Alert} from 'react-native';
import Navbar from '../Navbar/Navbar';
import RNFS from 'react-native-fs';
import {PDFDocument, rgb, PageSizes} from 'pdf-lib';
import analytics from '@react-native-firebase/analytics';
import {requestPermissions} from './Permission';
import Graphs from './Graphs';
import styles from './graphs.style';

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
  const number = route?.params?.chartNumber;

  useEffect(() => {
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

  const generatePdf = async () => {
    setLoading(true);
    try {
      setPdfURI(null);
      const pdfDoc = await PDFDocument.create();
      const chartsPerRow = 2;
      const chartsPerPage = 4;
      const margin = 50;
      const imageWidth = 200;
      const imageHeight = 200;
      const xOffset = 73;
      const yOffset = 742;

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

      const pdfBytes = await pdfDoc.saveAsBase64({dataUri: false});
      const pdfPath = `${RNFS.DocumentDirectoryPath}/graphs.pdf`;
      await RNFS.writeFile(pdfPath, pdfBytes, 'base64');
      await analytics().logEvent('pdf_generated', {
        pdfPath,
      });
      setPdfURI(`file://${pdfPath}`);
      Alert.alert(`PDF saved at: ${pdfPath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (pdfURI !== null) {
      navigation.navigate('PdfScreen', {pdfURI});
      setPdfURI(null);
    }
  }, [pdfURI]);

  return (
    <View style={styles.container}>
      <ScrollView onScroll={handleScroll} style={styles.scrollView}>
        {graphsArr.map((n, index) => (
          <Graphs
            chartData={chartData}
            setChartImages={setChartImages}
            index={index}
            setLoading={setLoading}
            key={n}
          />
        ))}
        <Button
          title={loading ? 'Preparing PDF' : 'Download PDF'}
          onPress={generatePdf}
          disabled={loading}
          color="#007bff"
        />
      </ScrollView>
      <Navbar navbarVisible={navbarVisible} />
    </View>
  );
};

export default ReactNativeGraphs;
