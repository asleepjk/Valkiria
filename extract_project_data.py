import arcpy
import json
import base64
import os

aprx_path = r"C:\Users\aquispee\Documents\ArcGIS\Projects\MyProject24\MyProject24.aprx"
output_dir = r"C:\inetpub\wwwroot\2026\valkiria\mapa\public"
layers_out_dir = os.path.join(output_dir, "data", "layers")
rasters_out_dir = os.path.join(output_dir, "data", "rasters")
symbols_out_dir = os.path.join(output_dir, "symbols")

os.makedirs(layers_out_dir, exist_ok=True)
os.makedirs(rasters_out_dir, exist_ok=True)
os.makedirs(symbols_out_dir, exist_ok=True)
arcpy.env.overwriteOutput = True

p = arcpy.mp.ArcGISProject(aprx_path)
m = [m for m in p.listMaps() if m.name == "Layers"][0]

print("Processing layers from map: Layers")
manifest = {
    "layers": [],
    "raster": None,
    "symbols": {}
}

# 1. Process Feature Layers
for lyr in m.listLayers():
    if not lyr.isFeatureLayer:
        continue
    
    clean_name = lyr.name.lower().replace(" ", "_")
    geojson_filename = f"{clean_name}.geojson"
    geojson_path = os.path.join(layers_out_dir, geojson_filename)
    
    print(f"Exporting {lyr.name} ({lyr.longName}) -> {geojson_filename}")
    try:
        # Export to GeoJSON in WGS84
        arcpy.conversion.FeaturesToJSON(
            in_features=lyr,
            out_json_file=geojson_path,
            format_json="NOT_FORMATTED",
            include_z_values="NO_Z_VALUES",
            include_m_values="NO_M_VALUES",
            geoJSON="GEOJSON",
            outputToWGS84="WGS84"
        )
        count = int(arcpy.management.GetCount(lyr)[0])
        shape_type = arcpy.Describe(lyr).shapeType
    except Exception as e:
        print(f"  Error exporting {lyr.name}: {e}")
        continue

    # Extract CIM symbology
    cim = lyr.getDefinition("V3")
    renderer = getattr(cim, "renderer", None)
    renderer_type = type(renderer).__name__ if renderer else None
    
    layer_info = {
        "id": clean_name,
        "name": lyr.name,
        "longName": lyr.longName,
        "file": f"data/layers/{geojson_filename}",
        "visible": lyr.visible,
        "count": count,
        "geometryType": shape_type,
        "rendererType": renderer_type
    }

    # Extract symbols / icons
    if renderer_type == "CIMSimpleRenderer":
        sym = renderer.symbol.symbol
        sym_type = type(sym).__name__
        layer_info["symbolType"] = sym_type
        
        # Check for picture markers
        for i, sl in enumerate(getattr(sym, "symbolLayers", [])):
            if type(sl).__name__ == "CIMPictureMarker":
                data_url = getattr(sl, "url", None)
                if data_url and data_url.startswith("data:image/png;base64,"):
                    icon_filename = f"{clean_name}_marker.png"
                    icon_path = os.path.join(symbols_out_dir, icon_filename)
                    raw_b64 = data_url.replace("data:image/png;base64,", "")
                    with open(icon_path, "wb") as f_img:
                        f_img.write(base64.b64decode(raw_b64))
                    layer_info["icon"] = f"symbols/{icon_filename}"
                    layer_info["iconSize"] = getattr(sl, "size", 16)
                    print(f"  Extracted icon: {icon_filename}")
            elif type(sl).__name__ == "CIMSolidStroke":
                c = getattr(sl, "color", None)
                layer_info["stroke"] = {
                    "color": list(c.values) if hasattr(c, "values") else [0, 0, 0, 100],
                    "width": getattr(sl, "width", 1)
                }
            elif type(sl).__name__ == "CIMSolidFill":
                c = getattr(sl, "color", None)
                layer_info["fill"] = {
                    "color": list(c.values) if hasattr(c, "values") else [200, 200, 200, 100]
                }
            elif type(sl).__name__ == "CIMHatchFill":
                layer_info["hatchFill"] = True

    elif renderer_type == "CIMUniqueValueRenderer":
        layer_info["fields"] = list(renderer.fields)
        groups = []
        for g in getattr(renderer, "groups", []):
            for c in getattr(g, "classes", []):
                sym = c.symbol.symbol
                class_info = {
                    "label": c.label,
                    "value": c.values[0].fieldValues[0] if getattr(c, "values", None) else c.label
                }
                for sl in getattr(sym, "symbolLayers", []):
                    if type(sl).__name__ == "CIMSolidStroke":
                        col = getattr(sl, "color", None)
                        class_info["stroke"] = {
                            "color": list(col.values) if hasattr(col, "values") else [0, 0, 0, 100],
                            "width": getattr(sl, "width", 1)
                        }
                    elif type(sl).__name__ == "CIMSolidFill":
                        col = getattr(sl, "color", None)
                        class_info["fill"] = {
                            "color": list(col.values) if hasattr(col, "values") else [200, 200, 200, 100]
                        }
                groups.append(class_info)
        layer_info["classes"] = groups

    manifest["layers"].append(layer_info)

# 2. Process MINUSCA Raster
print("\nExporting MINUSCA raster...")
minusca_src = r"C:\Users\aquispee\Documents\ArcGIS\Packages\PROYECTO VALKIRIA_8c868e\v108\data.gdb\MINUSCA"
minusca_out_png = os.path.join(rasters_out_dir, "minusca.png")
try:
    arcpy.management.CopyRaster(minusca_src, minusca_out_png, format="PNG")
    r = arcpy.Raster(minusca_src)
    extent = [r.extent.XMin, r.extent.YMin, r.extent.XMax, r.extent.YMax]
    manifest["raster"] = {
        "id": "minusca",
        "name": "MINUSCA",
        "file": "data/rasters/minusca.png",
        "extent": {
            "xmin": extent[0],
            "ymin": extent[1],
            "xmax": extent[2],
            "ymax": extent[3]
        },
        "spatialReference": 4326,
        "visible": False,
        "opacity": 0.85
    }
    print(f"MINUSCA exported. Extent: {extent}")
except Exception as e:
    print(f"Error exporting MINUSCA: {e}")

# 3. Save manifest configuration
manifest_path = os.path.join(output_dir, "data", "manifest.json")
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print(f"\nManifest saved to {manifest_path}")
print("Finished extraction.")
