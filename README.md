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

```
grafana-cli plugins install corpglory-progresslist-panel
```

### See Also
Dicussion on [Grafana Community Forum](https://community.grafana.com/t/progress-list-panel/3286)
Based on [Webpack Typescript Template](https://github.com/CorpGlory/grafana-plugin-template-webpack-typescript)

## About CorpGlory Inc.
The project developed by [CorpGlory Inc.](https://corpglory.com/), a company which provides high quality software development, data visualization, Grafana and monitoring consulting.
