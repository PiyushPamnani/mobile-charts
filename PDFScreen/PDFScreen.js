import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';
import useAnalytics from '../hook/useAnalytics';

const PDFScreen = ({route}) => {
  const {pdfURI} = route.params;

  useAnalytics('PDF Screen');

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{uri: pdfURI}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
          console.log(`File path: ${filePath}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={error => {
          console.log('Error loading PDF:', error);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height - 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    backgroundColor: '#e4e4e4',
  },
});

export default PDFScreen;
