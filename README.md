# Progress List Panel

<img src="https://github.com/CorpGlory/grafana-progress-list/blob/master/src/assets/screenshot_main.png">

## About

A panel showing list of progress-like items in one board. More about [development of the plugin](https://corpglory.com/s/grafana-progress-list/).

## How To Use

1. Create a metric query where result looks like this: `[(time, key, value)]`
2. Goto "Options" tab and choose aggregation function and other options

More info in [**tutorials**](https://github.com/CorpGlory/grafana-progress-list/wiki)

Progress list will try to aggregate all values by key using chosen aggregate function.

Progress list can be thought of as many simple [Singlestat Panels](http://docs.grafana.org/features/panels/singlestat/). But items are generated from the query, rather than defined manually.


## Installation

### Linux
- Navigate to either: 
  - `<GRAFANA_PATH>/data/plugins` (when Grafana is installed from tarball or source) 
  - or `/var/lib/grafana/plugins` (when Grafana is installed from `.deb`/`.rpm` package)

- Download Progress List Panel
```
wget https://github.com/CorpGlory/grafana-progress-list/archive/v1.0.7.tar.gz
```

- Unpack downloaded files
```
tar -zxvf v1.0.7.tar.gz
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
  -e "GF_INSTALL_PLUGINS=https://github.com/CorpGlory/grafana-progress-list/archive/v1.0.7.zip;corpglory-progresslist-panel" \
  grafana/grafana
```

## See Also
* Dicussion on [Grafana Community Forum](https://community.grafana.com/t/progress-list-panel/3286)
* Based on [Webpack Typescript Template](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript)
* more about Grafana from CorpGlory: https://corpglory.com/t/grafana/
* https://github.com/chartwerk/grafana-chartwerk-app -- advanced Grafana plugins from CorpGlory

## About CorpGlory Inc.
The project developed by [CorpGlory Inc.](https://corpglory.com/), a company which provides high quality software development, data visualization, Grafana and monitoring consulting.
