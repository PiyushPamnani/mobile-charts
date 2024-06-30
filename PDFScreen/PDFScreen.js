import React from 'react';
import {View, Dimensions} from 'react-native';
import Pdf from 'react-native-pdf';

const PDFScreen = ({route}) => {
  const {pdfURI} = route.params;

  return (
    <View style={{flex: 1}}>
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
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
    </View>
  );
};

export default PDFScreen;
