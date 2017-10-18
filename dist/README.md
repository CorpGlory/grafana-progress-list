# Progress List Panel

## About

A plugin showing list of progress-like list items in one board.

## How To Use


  * Create a metric query where result looks like this: `[(time, key, value)]`
  * Goto "Options" tab and choose aggregation function and other options

More info in [**tutorials**](https://github.com/CorpGlory/grafana-progress-list/wiki)

Progress list will try to aggregate all values with `key` to a singlie value with one of aggregate funtions.

You may think about progress list as many simple
[Singlestat Panels](http://docs.grafana.org/features/panels/singlestat/). The difference is 
that items generated from the query rather than defined manually.
