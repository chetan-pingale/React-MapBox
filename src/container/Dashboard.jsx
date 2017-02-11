/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import * as applicationActionCreators from '../actions/application';
import DashboardComponent from '../component/Dashboard';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hldGFucGluZ2FsZSIsImEiOiJjaXl5ODJxbjQwMDBkMndvY3I0YXg5aXZvIn0.w35lGeEIadlyViRvmizeBg';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapBoxObject: {},
        };
        this.handleAddPopup = this.handleAddPopup.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.drawPolygon = this.drawPolygon.bind(this);
        this.handleAddPointsClick = this.handleAddPointsClick.bind(this);
    }
    componentDidMount() {
        const map = new mapboxgl.Map({
            container: 'map',
            center: [103.8543, 1.2906],
            zoom: 9,
            hash: false,
            bearing: 0,
            pitch: 10,
            interactive: true,
            attributionControl: true,
            bearingSnap: 8,
            renderWorldCopies: false,
            transition: false,
            style: 'mapbox://styles/mapbox/streets-v9',
        });
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        this.setMapBoxObject(map);
    }
    setMapBoxObject(mapObj) {
        this.setState({ mapBoxObject: mapObj });
    }
    handleAddPopup() {
        const map = this.state.mapBoxObject;
        const coordinates = [103.8543, 1.2906];
        let popup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<div>Singapore Location Co-ordinate -${coordinates} </div>`)
          .addTo(map);
        map.setZoom(13);
        map.flyTo({ center: coordinates });
        this.props.actions.requestHeaderChange('Popup');
    }
    drawLine() {
        const map = this.state.mapBoxObject;
        const lineData = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: [
                  [103.65013878785908, 1.325552476401086],
                  [103.81798383994308, 1.447095445151575],
                  [103.81994754437017, 1.265401109213343],
                  [103.90903771364137, 1.415986232911862],
                ],
            },
        };
        if (map.getSource('line-layer')) {
            map.removeSource('line-layer');
            map.removeLayer('line-layer');
        }
        map.addLayer({
            id: 'line-layer',
            type: 'line',
            source: {
                type: 'geojson',
                data: lineData,
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': 'red',
                'line-width': 3,
            },
        });
        map.setZoom(9);
        map.flyTo({ center: [103.81798383994308, 1.447095445151575] });
        this.props.actions.requestHeaderChange('Line');
    }
    drawPolygon() {
        const map = this.state.mapBoxObject;
        const polygonData = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    [
                      [103.99637088421463, 1.365239976401242],
                      [103.96970584515202, 1.331443589682365],
                      [103.8407, 1.2764],
                      [103.8331, 1.3755],
                      [103.99637088421463, 1.365239976401242],
                    ],
                ],
            },
        };
        if (map.getSource('polygon-layer')) {
            map.removeSource('polygon-layer');
            map.removeLayer('polygon-layer');
        }
        map.addLayer({
            id: 'polygon-layer',
            type: 'fill',
            source: {
                type: 'geojson',
                data: polygonData,
            },
            layout: {},
            paint: {
                'fill-color': '#453df1',
                'fill-opacity': 0.6,
            },
        }, 'water');
        map.on('click', e => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['polygon-layer'] });
            if (features.length) {
                const coordinates = [e.lngLat.lng, e.lngLat.lat];
                map.setZoom(12);
                map.flyTo({ center: coordinates });
            }
        });
        map.setZoom(9);
        this.props.actions.requestHeaderChange('Polygon');
    }
    handleAddPointsClick() {
        const map = this.state.mapBoxObject;
        const canvas = map.getCanvasContainer();
        let isCursorOverPoint = false;
        let isDragging = false;
        const geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {
                    title: 'Point',
                },
                geometry: {
                    type: 'Point',
                    coordinates: [103.8119, 1.3237],
                },
            }],
        };
        if (map.getSource('points')) {
            map.removeSource('points');
            map.removeLayer('points');
        }
        map.addLayer({
            id: 'points',
            type: 'circle',
            source: {
                type: 'geojson',
                data: geojson,
            },
            paint: {
                'circle-radius': 11,
                'circle-color': 'gray',
            },
        });
        map.on('mousemove', e => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['points'] });
            if (features.length) {
                map.setPaintProperty('points', 'circle-color', '#3bb2d0');
                canvas.style.cursor = 'move';
                isCursorOverPoint = true;
                map.dragPan.disable();
            } else {
                map.setPaintProperty('points', 'circle-color', '#3887be');
                canvas.style.cursor = '';
                isCursorOverPoint = false;
                map.dragPan.enable();
            }
        });
        map.on('mousedown', () => {
            if (!isCursorOverPoint) return;
            isDragging = true;
            canvas.style.cursor = 'grab';
            map.on('mousemove', event => {
                if (!isDragging) return;
                const coords = event.lngLat;
                canvas.style.cursor = 'grabbing';
                geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
                map.getSource('points').setData(geojson);
            });
            map.once('mouseup', () => {
                if (!isDragging) return;
                canvas.style.cursor = '';
                isDragging = false;
                map.off('mousemove', evs => {
                    if (!isDragging) return;
                    const coords = evs.lngLat;
                    canvas.style.cursor = 'grabbing';
                    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
                    map.getSource('points').setData(geojson);
                });
            });
        }, true);
        map.setZoom(11);
        map.flyTo({ center: [103.8119, 1.3237] });
        this.props.actions.requestHeaderChange('Point');
    }
    render() {
        const styles = {
            map: {
                width: '40%',
                height: '70%',
                bottom: '0px',
                top: '0px',
                position: 'absolute',
                marginTop: '7%',
                marginLeft: '40%',
            },
        };
        return (
          <div>
            <DashboardComponent
              handleAddPopup={this.handleAddPopup}
              handleDrawLine={this.drawLine}
              handleDrawPolygon={this.drawPolygon}
              handleAddPointsClick={this.handleAddPointsClick}
              styles={styles}
              {...this.props}
              {...this.state}
            />
          </div>
        );
    }
}

Dashboard.propTypes = {
    actions: React.PropTypes.object,
};

const mapStateToProps = state => {
    const headerTitle = state.application.headerTitle;
    return { headerTitle };
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(applicationActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
