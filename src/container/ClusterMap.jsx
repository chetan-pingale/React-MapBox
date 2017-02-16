/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';
import * as applicationActionCreators from '../actions/application';
import ClusterMapComponent from '../component/ClusterMap';
import clusterData from '../utils/clusterData';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hldGFucGluZ2FsZSIsImEiOiJjaXl5ODJxbjQwMDBkMndvY3I0YXg5aXZvIn0.w35lGeEIadlyViRvmizeBg';

class ClusterMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapBoxObject: {},
            navListItems: [],
            isMapLoaded: false,
        };
        this.drawClusterPoints = this.drawClusterPoints.bind(this);
        this.getNavList = this.getNavList.bind(this);
        this.navigateToHome = this.navigateToHome.bind(this);
    }
    componentDidMount() {
        const map = new mapboxgl.Map({
            container: 'map',
            // center: [-103.59179687498357, 40.66995747013945],
            center: [103.8543, 1.2906],
            zoom: 7,
            hash: false,
            style: 'mapbox://styles/mapbox/streets-v9',
        });
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        // map.addControl(new mapboxgl.GeolocateControl({
        //     accessToken: mapboxgl.accessToken,
        // }));
        this.setMapBoxObject(map);
    }
    getNavList() {
        const navListItems = [
          { id: 1, navTitle: 'Draw Cluster Points', isActive: false, clickHandler: this.drawClusterPoints },
        ];
        return navListItems;
    }
    setMapBoxObject(mapObj) {
        const navItems = this.getNavList();
        this.setState({ mapBoxObject: mapObj, navListItems: navItems });
    }
    setNavItemData(id) {
        const navItems = this.state.navListItems;
        _.forEach(navItems, (item, index) => {
            navItems[index].isActive = (item.id === id);
        });
        this.setState({ navListItems: navItems, isMapLoaded: true });
    }
    navigateToHome() {
        this.props.actions.navigateToHome();
    }
    drawClusterPoints(event, selectedId) {
        const map = this.state.mapBoxObject;
        if (!this.state.isMapLoaded) {
            const popup = new mapboxgl.Popup({
                closeButton: false,
            });
            map.addSource('earthquakes', {
                type: 'geojson',
                data: clusterData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50,
            });
            map.addLayer({
                id: 'unclustered-points',
                type: 'symbol',
                source: 'earthquakes',
                filter: ['!has', 'point_count'],
                layout: {
                    'icon-image': 'marker-15',
                },
            });
            const layers = [[150, '#f28cb1'], [20, '#f1f075'], [0, '#51bbd6']];
            const layersData = [];
            layers.forEach((layer, i) => {
                const name = `cluster-${i}`;
                layersData.push(name);
                map.addLayer({
                    id: name,
                    type: 'circle',
                    source: 'earthquakes',
                    paint: {
                        'circle-color': layer[1],
                        'circle-radius': 20,
                        'circle-blur': 1,
                    },
                    filter: i === 0 ?
                      ['>=', 'point_count', layer[0]] :
                    ['all',
                      ['>=', 'point_count', layer[0]],
                      ['<', 'point_count', layers[i - 1][0]]],
                });
            });
            map.addLayer({
                id: 'cluster-point',
                type: 'symbol',
                source: 'earthquakes',
                layout: {
                    'text-field': '{point_count}',
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                    'text-size': 12,
                    'icon-image': '{icon}-15',
                    'icon-allow-overlap': true,
                },
            });
            layersData.push('cluster-point');
            map.on('mousemove', e => {
                const features = map.queryRenderedFeatures(e.point, { layers: layersData });
                map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
                if (!features.length) {
                    popup.remove();
                    return;
                }
                const feature = features[0];
                if (feature.layer.id !== 'cluster-point' && feature.properties.point_count) {
                    popup.setLngLat(e.lngLat)
                      .setText(`Points Count - ${feature.properties.point_count}`)
                      .addTo(map);
                } else if (feature.layer.id === 'cluster-point' && feature.properties.text) {
                    const textValue = _.isString(feature.properties.text)
                      ? feature.properties.text : `${e.lngLat.lng} - ${e.lngLat.lat}`;
                    popup.setLngLat(e.lngLat)
                      .setText(textValue)
                      .addTo(map);
                }
            });
        }
        map.setZoom(10);
        this.props.actions.requestHeaderChange('Cluster Points');
        this.setNavItemData(selectedId);
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
            <ClusterMapComponent
              styles={styles}
              navigateToHome={this.navigateToHome}
              {...this.props}
              {...this.state}
            />
          </div>
        );
    }
}

ClusterMap.propTypes = {
    actions: React.PropTypes.object,
};

const mapStateToProps = state => {
    const headerTitle = state.application.headerTitle;
    return { headerTitle };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(applicationActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterMap);
