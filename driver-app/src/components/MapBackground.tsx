import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export interface MapBackgroundRef {
    flyToLocation: (lat: number, lng: number) => void;
    drawRoute: (geoJsonData: any) => void;
    clearRoute: () => void;
    updateMarkers: (fromLat: number | null, fromLng: number | null, destLat: number | null, destLng: number | null) => void;
    drawDrivers: (drivers: Array<{ lat: number, lng: number }>) => void;
    clearDrivers: () => void;
}

export interface MapBackgroundProps {
    initialLat?: number;
    initialLng?: number;
    onMapMove?: (lat: number, lng: number) => void;
}

const MapBackground = React.memo(forwardRef<MapBackgroundRef, MapBackgroundProps>((props, ref) => {
    const webViewRef = useRef<WebView>(null);

    // UIT location default if not provided
    const lat = props.initialLat ?? 10.8700;
    const lng = props.initialLng ?? 106.8031;

    useImperativeHandle(ref, () => ({
        flyToLocation: (newLat: number, newLng: number) => {
            const runJS = `
        if (typeof map !== 'undefined' && map) {
          map.flyTo([${newLat}, ${newLng}], 17, {
            animate: true,
            duration: 1.5 
          });
        }
        true; 
      `;
            webViewRef.current?.injectJavaScript(runJS);
        },
        drawRoute: (geoJsonData: any) => {
            const runJS = `
        if (typeof map !== 'undefined' && map) {
          if (window.routeLayer) {
            map.removeLayer(window.routeLayer);
          }
          
          window.routeLayer = L.geoJSON(${JSON.stringify(geoJsonData)}, {
            style: { color: '#FF4D4D', weight: 5, opacity: 0.8 }
          }).addTo(map);

          map.fitBounds(window.routeLayer.getBounds(), { padding: [50, 50] });
        }
        true;
      `;
            webViewRef.current?.injectJavaScript(runJS);
        },
        clearRoute: () => {
            const runJS = `
        if (typeof map !== 'undefined' && map) {
          if (window.routeLayer) {
            map.removeLayer(window.routeLayer);
            window.routeLayer = null; 
          }
        }
        true;
      `;
            webViewRef.current?.injectJavaScript(runJS);
        },
        updateMarkers: (fromLat: number | null, fromLng: number | null, destLat: number | null, destLng: number | null) => {
            const runJS = `
        if (typeof map !== 'undefined' && map) {
          if (window.fromMarker) { map.removeLayer(window.fromMarker); window.fromMarker = null; }
          if (window.destMarker) { map.removeLayer(window.destMarker); window.destMarker = null; }

          var fLat = ${fromLat}; var fLng = ${fromLng};
          var dLat = ${destLat}; var dLng = ${destLng};

          if (fLat && fLng) {
            var fromIcon = L.divIcon({
              html: "<div style='width: 44px; height: 44px; border-radius: 22px; border: 3px solid #FFBB1C; background: white; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);'><img src='https://i.pravatar.cc/150?u=user' style='width: 40px; height: 40px; border-radius: 20px;'/></div>",
              className: '',
              iconSize: [44, 44],
              iconAnchor: [22, 22]
            });
            window.fromMarker = L.marker([fLat, fLng], {icon: fromIcon}).addTo(map);
          }

          if (dLat && dLng) {
            var destIcon = L.divIcon({
              html: "<div style='width: 24px; height: 24px; background-color: #FF4D4D; border-radius: 12px; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);'></div>",
              className: '',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            });
            window.destMarker = L.marker([dLat, dLng], {icon: destIcon}).addTo(map);
          }
        }
        true;
      `;
            webViewRef.current?.injectJavaScript(runJS);
        },
        drawDrivers: (drivers: Array<{ lat: number, lng: number }>) => {
            const runJS = `
        if (typeof map !== 'undefined' && map) {
          try {
            if (window.driverMarkers) {
              window.driverMarkers.forEach(m => map.removeLayer(m));
            }
            window.driverMarkers = [];
            
            var driversData = ${JSON.stringify(drivers)};
            driversData.forEach(d => {
              var carIcon = L.divIcon({
                html: "<div style='font-size: 26px; transform: scaleX(-1); filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));'>🚖</div>",
                className: '',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              });
              var marker = L.marker([d.lat, d.lng], {icon: carIcon}).addTo(map);
              window.driverMarkers.push(marker);
            });
          } catch(e) {}
        }
        true;
      `;
            webViewRef.current?.injectJavaScript(runJS);
        },
        clearDrivers: () => {
            const runJS = `
        if (typeof map !== 'undefined' && map) {
          if (window.driverMarkers) {
            window.driverMarkers.forEach(m => map.removeLayer(m));
            window.driverMarkers = [];
          }
        }
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
          maxZoom: 19,
        }).addTo(map);

        map.on('moveend', function () {
          var center = map.getCenter();
          var dataToRN = JSON.stringify({
            type: 'onMapMove',
            lat: center.lat,
            lng: center.lng
          });
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
                props.onMapMove?.(data.lat, data.lng);
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
                source={{ html: leafletHTML, baseUrl: 'https://unpkg.com' }}
                style={StyleSheet.absoluteFillObject}
                mixedContentMode="compatibility"
                allowFileAccess={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                androidLayerType="hardware"
                scrollEnabled={false}
                bounces={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={handleOnMessage}
            />
        </View>
    );
}));

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    }
});

export default MapBackground;
