# Progress List Panel

<img src="https://github.com/CorpGlory/grafana-progress-list/blob/master/src/assets/screenshot_main.png">

## About

Show list of progress items by mapping your data.

## How To Use

1. Create a metric query where result looks like this: `[(time, key, value)]`
2. Goto Options tab and adjust your progress list.

See examples: (Tutorial Wiki)[https://github.com/CorpGlory/grafana-progress-list/wiki]

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


### See Also

Based on [Webpack Typescript Template](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript)