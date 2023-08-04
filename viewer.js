import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

export default class CesiumViewer{

    constructor(){

        this.viewer = new Cesium.Viewer('app', {
            imageryProvider: CesiumViewer.getImageryProvider(),
            baseLayerPicker: false,
            geocoder: false,
            timeline: false,
            animation: false,
            homeButton: false,
            navigationInstructionsInitiallyVisible: true,
            navigationHelpButton: false,
            sceneModePicker: false,
            fullscreenButton: false,
        });
        this.toColor = false;
    }

    static getImageryProvider(){
        return new Cesium.WebMapTileServiceImageryProvider({
            url : 'https://c.basemaps.cartocdn.com/light_nolabels/{TileMatrix}/{TileCol}/{TileRow}.png',
            layer : 'carto-light',
            style : 'default',
            format : 'image/jpeg',
            maximumLevel: 19,
            tileMatrixSetID : 'default',
            credit : new Cesium.Credit('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>')
        });
    }

    async toggle3DModel() {

        if (this.model3d) {
            this.viewer.dataSources.remove(this.model3d);
            this.model3d = null;
        }  else {
            this.model3d = await Cesium.GeoJsonDataSource.load('./pa.geojson');
            this.viewer.dataSources.add(this.model3d);
            const entities = this.model3d.entities.values;
            for (var i = 0; i < entities.length; i++) {
                const entity = entities[i];
                if (!entity.properties.horizontal) {
                    const color = Cesium.Color.GOLD.withAlpha(0.7);
                    const outcolor = Cesium.Color.GOLD.withAlpha(1.0);
                    entity.polygon.extrudedHeight = 15;
                    entity.polygon.material = color;
                    entity.polygon.outlineColor = outcolor;
                } else {
                    const color = Cesium.Color.FORESTGREEN.withAlpha(0.7);
                    const outcolor = Cesium.Color.FORESTGREEN.withAlpha(1.0);
                    entity.polygon.extrudedHeight = 0;
                    entity.polygon.material = color;
                    entity.polygon.outlineColor = outcolor;
                }
            }
            this.viewer.zoomTo(this.model3d);

        }
    }

    togglePointCloud() {
        if (this.pointCloud) {
            this.viewer.scene.primitives.remove(this.pointCloud);
            this.pointCloud = null;
        } else {
            this.pointCloud = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
                url : './data/tileset.json'
            }));
            this.pointCloud.pointCloudShading.attenuation = true;
            this.pointCloud.pointCloudShading.eyeDomeLighting = true;
            this.pointCloud.style = new Cesium.Cesium3DTileStyle({
                color: "rgb(${Intensity}, ${Intensity}, ${Intensity})",
            });
            // this.viewer.zoomTo(this.pointCloud);
        }
    }

    togglePOI() {
        if (this.poi) {
            this.viewer.dataSources.remove(this.poi);
            this.poi = null;
        } else {
            this.poi = new Cesium.GeoJsonDataSource();
            this.poi.load('./poi.geojson',  {
                markerColor: Cesium.Color.fromCssColorString('#418BDC'),
                markerSymbol: 'park',
                markerSize: 50
            });
            this.viewer.dataSources.add(this.poi);
            // this.viewer.zoomTo(this.poi);
        }
    }

    toggleMust(){
        if (this.must) {
            this.viewer.dataSources.remove(this.must);
            this.must = null;
        } else {
            this.must = new Cesium.GeoJsonDataSource();
            this.must.load('./must.geojson', {
                markerColor: Cesium.Color.fromCssColorString('#CA4F43'),
                markerSymbol: 'M',
                markerSize: 50
            });

            this.viewer.dataSources.add(this.must);
            // this.viewer.zoomTo(this.must);
        }
    }

    async colorMust(){
        this.toColor = !this.toColor;
        const must = await fetch('./must.geojson').then(r=>r.json());
        const buidings = must.features.map(f=>f.properties.markerArray[0].buildingId);
        console.log(buidings);
        const entities = this.model3d.entities.values;
        for (var i = 0; i < entities.length; i++) {
            console.log('ECCO');
            const entity = entities[i];

            console.log(entity.properties.sticazzi);
            console.log(entity.properties.id);
            if (buidings.includes(entity.properties.id._value) && this.toColor) {
                console.log('ECCO1');
                const color = Cesium.Color.RED.withAlpha(0.7);
                const outcolor = Cesium.Color.RED.withAlpha(1.0);
                entity.polygon.extrudedHeight = !entity.properties.horizontal ? 15 : 0;
                entity.polygon.material = color;
                entity.polygon.outlineColor = outcolor;
            } else {
                if (!entity.properties.horizontal) {
                    const color = Cesium.Color.GOLD.withAlpha(0.7);
                    const outcolor = Cesium.Color.GOLD.withAlpha(1.0);
                    entity.polygon.extrudedHeight = 15;
                    entity.polygon.material = color;
                    entity.polygon.outlineColor = outcolor;
                } else {
                    const color = Cesium.Color.FORESTGREEN.withAlpha(0.7);
                    const outcolor = Cesium.Color.FORESTGREEN.withAlpha(1.0);
                    entity.polygon.extrudedHeight = 0;
                    entity.polygon.material = color;
                    entity.polygon.outlineColor = outcolor;
                }
            }

        }
    }


}

