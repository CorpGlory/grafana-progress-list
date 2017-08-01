import { MetricsPanelCtrl } from 'app/plugins/sdk';
import _ from 'lodash';


class Ctrl extends MetricsPanelCtrl {
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

Ctrl.template = '<div/>';

export { Ctrl as PanelCtrl }
