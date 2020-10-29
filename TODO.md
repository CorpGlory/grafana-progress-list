## Problem
In this PR I am trying to avoid code repetition in the templates,
which has already showed that it's root of bugs.

## UI/UX Changes

### Multibar mode
Now the plugin always work in "multibar mode". All panels in "single mode"
which return more that one metric should be fixed like in example:

```sql
SELECT role, count_ok, count_warn, count_alert from multiprogress order by count_ok desc
```

should become
```sql
SELECT role, count_ok from multiprogress order by count_ok desc
```
to get previous way or showing bars.

### New labels in options
There is not checkbox `Mulibar`.

The fixes of options panel are based on https://github.com/CorpGlory/grafana-progress-list/issues/64
Now it looks like this:
<insert screenshot>



## Changes
### Directives
Merge all directives into `template.html` without using directives at all.
Angular works pretty slow and I would keep the codebase simpler.
Also removing of that template will get me closer to design of chartwerk panels.

### Other
* no initialisation of directives in `Ctrl.constructor()`