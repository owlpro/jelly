import React, { Component } from "react";
import PropTypes from 'prop-types';

import { Col } from "react-bootstrap";
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import RoomIcon from '@material-ui/icons/Room';

import AsyncSelect from 'react-select/async';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import L from "leaflet";
import axios from "axios";

L.Marker.prototype.options.icon = L.icon({
    ...L.Icon.Default.prototype.options,
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow
});


function LocationMarker(props) {
    const map = useMapEvents({
        moveend() {
            props.effectOn.onMoveend(map)
        },
    });

    // L.tileLayer.provider('transportmap').addTo(map)

    props.setMap(map)
    return null;
}

class SCMap extends Component {

    initLatlng = {
        lat: 35.69961659925912,
        lng: 51.33760929107667,
    };

    state = {
        ...this.props,
        value: '',
        lat: 35.69961659925912,
        lng: 51.33760929107667,
        zoom: 14,
        draggable: true,
        defaultAddresses: []
    }

    searchTimeout = null;
    mapEvents = null

    componentDidMount() {
        if (this.props.value) {
            setTimeout(() => {
                this.setValue(this.props.value);
            }, 0)
        }
    }

    setValue = (latlng, zoom = null) => {
        this.setState(state => {
            const ns = { ...state };
            ns.lat = latlng.lat;
            ns.lng = latlng.lng;
            return ns;
        });
        this.mapEvents.flyTo(latlng, zoom || this.mapEvents.getZoom());
    }

    getValue = () => {
        return {
            lat:  this.state.lat,
            lng: this.state.lng,
            zoom: this.state.zoom,
        };
    }

    clear = () => {
        this.setValue(this.initLatlng, 14);
    }

    onMoveend = map => {
        let latlng = map.getCenter();
        let zoom = map.getZoom();

        this.setState(state => {
            state.lat = latlng.lat;
            state.lng = latlng.lng;
            state.zoom = zoom;
            return { ...state }
        });
    }

    renderAddressData = (response, searchedAddress) => {
        if (response === null) return [];

        let convertedData = response.data.map((item, index) => {
            let address = [
                item.address.country,
                item.address.region,
                item.address.state,
                item.address.province,
                item.address.municipality,
                item.address.neighbourhood,
                item.address.road,
                item.address.address29,
                item.address.mall,
            ]
            return {
                // label: item.display_name,
                label: address.filter(adrs => adrs !== undefined).join(', '),
                lat: item.lat,
                lng: item.lon,
                value: item.lat + "," + item.lon + ":" + index
            }
        });


        this.setState(state => {
            state.defaultAddresses = convertedData;
            return { ...state };
        })

        return convertedData;
    }

    onSearchAddress = (data, callback) => {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            data = data.trim();
            if (data.length > 0) {
                axios.get("https://nominatim.openstreetmap.org/search?q=" + data + "&addressdetails=true&format=json").then(response => {
                    callback(this.renderAddressData(response, data))
                });
            }
        }, 1000)
    }

    onSelectAddress = (address) => {
        if (address) {
            let latlng = {
                lat: parseFloat(address.lat),
                lng: parseFloat(address.lng),
            };
            this.setValue(latlng)
        }
    }

    setMap = map => {
        this.mapEvents = map
    }

    validationError = () => {}
    
    render() {
        return (
            <React.Fragment>
                <Col xs={this.state.col}>
                    <label>
                        {this.state.isRequired ? (<React.Fragment>{this.state.label} <span className="smart_crud_label_required">*</span></React.Fragment>) : this.state.label}
                    </label>
                    <div className="smartcrud_map_wrapper">
                        <AsyncSelect
                            cacheOptions
                            defaultOptions={this.state.defaultAddresses}
                            loadOptions={this.onSearchAddress}
                            onChange={this.onSelectAddress}
                            isRtl={true}
                            classNamePrefix={"search_address_selection"}
                            isClearable={true}
                            className="smartcrud_map_search_input"
                            placeholder="جستجوی آدرس در نقشه" />
                        <MapContainer
                            center={[this.state.lat, this.state.lng]}
                            zoom={this.state.zoom}
                            scrollWheelZoom={false}
                        >

                            <TileLayer
                                attribution='&amp;copy MentaSystem'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <div className="mapFixedPointer">
                                <RoomIcon className="map_pointer_icon" />
                            </div>
                            {/* <Marker position={[this.state.lat, this.state.lng]}>
                                <Popup> A pretty CSS3 popup. <br /> Easily customizable. </Popup>
                            </Marker> */}
                            <LocationMarker effectOn={this} setMap={this.setMap} />
                        </MapContainer>
                    </div>
                </Col>
            </React.Fragment>
        )
    }
}
SCMap.propTypes = {
    selector: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    col: PropTypes.number.isRequired
};

export default SCMap;