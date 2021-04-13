# Progress List Panel

<img width="1119" alt="Screenshot 2021-02-16 at 18 24 36" src="https://user-images.githubusercontent.com/66464000/108075841-41640500-7084-11eb-9492-6e958d414b82.png">

## About

A panel showing list of progress-like items in one board. 

## How To Use

1. Create a metric query with Table data format
2. Go to "Options" tab and select which column to use as bars title and which columns to skip
3. Customize Progress List appearance by using other options

Progress list can be thought of as many simple [Singlestat Panels](http://docs.grafana.org/features/panels/singlestat/). But items are generated from the query, rather than defined manually.

## Demo

[Explore demo](https://grafana.corpglory.com/d/2v8-HypGk/progress-list-01-basic?orgId=4)

## Display options 
* Columns type selection (Key column, Skip Column) 
* Tooltip selection (all series/single)
* Value labeling (Prefix, Postfix, Size, Decimals, Null Value)
* Selection by type (absolute/percentage)  
* Sorting
* Limitation 
* Key labels (Line type (line/inline), size, Alias) 
* Coloring (Opacity, pallet, thresholds, key determination) 

About [development of the plugin](https://corpglory.com/s/grafana-progress-list/).


## Installation

### Linux
- Navigate to either: 
  - `<GRAFANA_PATH>/data/plugins` (when Grafana is installed from tarball or source) 
  - or `/var/lib/grafana/plugins` (when Grafana is installed from `.deb`/`.rpm` package)

- Download Progress List Panel
```
wget https://github.com/CorpGlory/grafana-progress-list/archive/v1.0.9.tar.gz
```

- Unpack downloaded files
```
tar -zxvf v1.0.9.tar.gz
```

- Restart grafana-server
  - For Grafana installed via Standalone Linux Binaries:
    - Stop any running instances of grafana-server
    - Start grafana-server by:
      ```$GRAFANA_PATH/bin/grafana-server```
  - For grafana installed via Package Manager:
    - type in ```systemctl restart grafana-server```

### Grafana in Docker
You can install Progress List Panel to Grafana in Docker passing it as environment variable (as described in [Grafana docs](http://docs.grafana.org/installation/docker/#installing-plugins-from-other-sources))

```bash
docker run \
  -p 3000:3000 \
  -e "GF_INSTALL_PLUGINS=https://github.com/CorpGlory/grafana-progress-list/archive/v1.0.9.zip;corpglory-progresslist-panel" \
  grafana/grafana
```

## See Also
* Dicussion on [Grafana Community Forum](https://community.grafana.com/t/progress-list-panel/3286)
* Based on [Webpack Typescript Template](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript)
* more about Grafana from CorpGlory: https://corpglory.com/t/grafana/
* https://github.com/chartwerk/grafana-chartwerk-app -- advanced Grafana plugins from CorpGlory

## About CorpGlory Inc.
The plugin is developed by [CorpGlory Inc.](https://corpglory.com/), a company which provides software development, data visualization, Grafana and monitoring consulting services.
