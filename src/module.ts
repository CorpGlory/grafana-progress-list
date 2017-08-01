import { MetricsPanelCtrl } from 'app/plugins/sdk';
import * as _ from 'lodash';


class Ctrl extends MetricsPanelCtrl {
  static template = "template.html";
  constructor($scope, $injector) {
    super($scope, $injector);
  }

  link(scope, element) {
  }

  _initEditMode() {
  }

  _dataReceived(data) {
    this.$scope.data = data;
  }

  _dataError(err) {
    this.$scope.data = [];
    this.$scope.dataError = err;
  }

}


export { Ctrl as PanelCtrl }
