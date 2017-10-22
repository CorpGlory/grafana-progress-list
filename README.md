# Progress List Panel

<img src="https://github.com/CorpGlory/grafana-progress-list/blob/master/src/assets/screenshot_main.png">

## About

A panel showing list of progress-like list items in one board.

## How To Use

1. Create a metric query where result looks like this: `[(time, key, value)]`
2. Goto "Options" tab and choose aggregation function and other options

More info in [**tutorials**](https://github.com/CorpGlory/grafana-progress-list/wiki)

Progress list will try to aggregate all values by key using chosen aggregate function.

Progress list can be thought of as many simple [Singlestat Panels](http://docs.grafana.org/features/panels/singlestat/). But items are generated from the query, rather than defined manually.


## Installation

```
cd $GRAFANA_HOME/data/plugins
git clone https://github.com/CorpGlory/grafana-progress-list.git
```

then restart your Grafana server

## Build

```
npm install
npm run build
```

## Credits

Made by Alexey Velikiy

### See Also

Dicussion on [Grafana Community Forum](https://community.grafana.com/t/progress-list-panel/3286)

Based on [Webpack Typescript Template](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript)
