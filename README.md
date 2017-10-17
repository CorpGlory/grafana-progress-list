# Progress List Panel

<img src="https://github.com/CorpGlory/grafana-progress-list/blob/master/src/assets/screenshot_main.png">

## About

A plugin showing list of progress-like list items in one board.

## How To Use

1. Create a metric query where result looks like this: `[(time, key, value)]`
2. Goto "Options" tab and choose aggregation function and other options

More info in [**tutorials**](https://github.com/CorpGlory/grafana-progress-list/wiki)

Progress list will try to aggregate all values with `key` to a singlie value with one of aggregate funtions.

You may think about progress list as many simple
[Singlestat Panels](http://docs.grafana.org/features/panels/singlestat/). The difference is 
that items generated from the query rather than defined manually.


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

Based on [Webpack Typescript Template](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript)