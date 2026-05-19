import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export interface MapBackgroundRef {
  flyToLocation: (lat: number, lng: number) => void;
  drawRoute: (geoJsonData: any) => void;
}

const MapBackground = forwardRef<MapBackgroundRef>((props, ref) => {
  const webViewRef = useRef<WebView>(null);

  // UIT location
  const lat = 10.8700;
  const lng = 106.8031;

  useImperativeHandle(ref, () => ({
    flyToLocation: (newLat: number, newLng: number) => {
      const runJS = `
        map.flyTo([${newLat}, ${newLng}], 17, {
          animate: true,
          duration: 1.5 
        });
        true; 
      `;
      webViewRef.current?.injectJavaScript(runJS);
    },
    drawRoute: (geoJsonData: any) => {
      const runJS = `
        if (window.routeLayer) {
          map.removeLayer(window.routeLayer);
        }
        
        window.routeLayer = L.geoJSON(${JSON.stringify(geoJsonData)}, {
          style: { color: '#FF4D4D', weight: 5, opacity: 0.8 }
        }).addTo(map);

        map.fitBounds(window.routeLayer.getBounds(), { padding: [50, 50] });
        true;
      `;
      webViewRef.current?.injectJavaScript(runJS);
    }
  }));

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
        .leaflet-control-attribution { display: none; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false 
        }).setView([${lat}, ${lng}], 15);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // L.tileLayer('https://a.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        map.on('moveend', function () {
          var center = map.getCenter(); // Lấy tọa độ tâm màn hình
          
          // Đóng gói dữ liệu thành chuỗi JSON
          var dataToRN = JSON.stringify({
            type: 'onMapMove',
            lat: center.lat,
            lng: center.lng
          });
          
          // Dùng hàm đặc biệt này để ném dữ liệu ra ngoài cho React Native chụp lấy
          window.ReactNativeWebView.postMessage(dataToRN);
        });
      </script>
    </body>
    </html>
  `;

  const handleOnMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'onMapMove') {
        console.log("📍 Tọa độ trung tâm Map hiện tại là:", data.lat, data.lng);
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ Map:", error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={StyleSheet.absoluteFillObject}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={handleOnMessage}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  }
});

export default MapBackground;