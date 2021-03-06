function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/kison/item.js']) {
  _$jscoverage['/kison/item.js'] = {};
  _$jscoverage['/kison/item.js'].lineData = [];
  _$jscoverage['/kison/item.js'].lineData[6] = 0;
  _$jscoverage['/kison/item.js'].lineData[7] = 0;
  _$jscoverage['/kison/item.js'].lineData[9] = 0;
  _$jscoverage['/kison/item.js'].lineData[10] = 0;
  _$jscoverage['/kison/item.js'].lineData[11] = 0;
  _$jscoverage['/kison/item.js'].lineData[12] = 0;
  _$jscoverage['/kison/item.js'].lineData[16] = 0;
  _$jscoverage['/kison/item.js'].lineData[17] = 0;
  _$jscoverage['/kison/item.js'].lineData[18] = 0;
  _$jscoverage['/kison/item.js'].lineData[22] = 0;
  _$jscoverage['/kison/item.js'].lineData[29] = 0;
  _$jscoverage['/kison/item.js'].lineData[31] = 0;
  _$jscoverage['/kison/item.js'].lineData[32] = 0;
  _$jscoverage['/kison/item.js'].lineData[33] = 0;
  _$jscoverage['/kison/item.js'].lineData[35] = 0;
  _$jscoverage['/kison/item.js'].lineData[36] = 0;
  _$jscoverage['/kison/item.js'].lineData[38] = 0;
  _$jscoverage['/kison/item.js'].lineData[39] = 0;
  _$jscoverage['/kison/item.js'].lineData[40] = 0;
  _$jscoverage['/kison/item.js'].lineData[43] = 0;
  _$jscoverage['/kison/item.js'].lineData[47] = 0;
  _$jscoverage['/kison/item.js'].lineData[53] = 0;
  _$jscoverage['/kison/item.js'].lineData[54] = 0;
  _$jscoverage['/kison/item.js'].lineData[55] = 0;
  _$jscoverage['/kison/item.js'].lineData[56] = 0;
  _$jscoverage['/kison/item.js'].lineData[57] = 0;
  _$jscoverage['/kison/item.js'].lineData[60] = 0;
}
if (! _$jscoverage['/kison/item.js'].functionData) {
  _$jscoverage['/kison/item.js'].functionData = [];
  _$jscoverage['/kison/item.js'].functionData[0] = 0;
  _$jscoverage['/kison/item.js'].functionData[1] = 0;
  _$jscoverage['/kison/item.js'].functionData[2] = 0;
  _$jscoverage['/kison/item.js'].functionData[3] = 0;
  _$jscoverage['/kison/item.js'].functionData[4] = 0;
  _$jscoverage['/kison/item.js'].functionData[5] = 0;
}
if (! _$jscoverage['/kison/item.js'].branchData) {
  _$jscoverage['/kison/item.js'].branchData = {};
  _$jscoverage['/kison/item.js'].branchData['11'] = [];
  _$jscoverage['/kison/item.js'].branchData['11'][1] = new BranchData();
  _$jscoverage['/kison/item.js'].branchData['17'] = [];
  _$jscoverage['/kison/item.js'].branchData['17'][1] = new BranchData();
  _$jscoverage['/kison/item.js'].branchData['32'] = [];
  _$jscoverage['/kison/item.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/kison/item.js'].branchData['35'] = [];
  _$jscoverage['/kison/item.js'].branchData['35'][1] = new BranchData();
  _$jscoverage['/kison/item.js'].branchData['38'] = [];
  _$jscoverage['/kison/item.js'].branchData['38'][1] = new BranchData();
  _$jscoverage['/kison/item.js'].branchData['39'] = [];
  _$jscoverage['/kison/item.js'].branchData['39'][1] = new BranchData();
  _$jscoverage['/kison/item.js'].branchData['55'] = [];
  _$jscoverage['/kison/item.js'].branchData['55'][1] = new BranchData();
}
_$jscoverage['/kison/item.js'].branchData['55'][1].init(22, 13, '!lookAhead[l]');
function visit89_55_1(result) {
  _$jscoverage['/kison/item.js'].branchData['55'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].branchData['39'][1].init(22, 54, '!equals(self.get(\'lookAhead\'), other.get(\'lookAhead\'))');
function visit88_39_1(result) {
  _$jscoverage['/kison/item.js'].branchData['39'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].branchData['38'][1].init(289, 16, '!ignoreLookAhead');
function visit87_38_1(result) {
  _$jscoverage['/kison/item.js'].branchData['38'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].branchData['35'][1].init(170, 52, 'other.get(\'dotPosition\') !== self.get(\'dotPosition\')');
function visit86_35_1(result) {
  _$jscoverage['/kison/item.js'].branchData['35'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].branchData['32'][1].init(48, 55, '!other.get(\'production\').equals(self.get(\'production\'))');
function visit85_32_1(result) {
  _$jscoverage['/kison/item.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].branchData['17'][1].init(18, 10, '!(i in s1)');
function visit84_17_1(result) {
  _$jscoverage['/kison/item.js'].branchData['17'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].branchData['11'][1].init(18, 10, '!(i in s2)');
function visit83_11_1(result) {
  _$jscoverage['/kison/item.js'].branchData['11'][1].ranCondition(result);
  return result;
}_$jscoverage['/kison/item.js'].lineData[6]++;
KISSY.add(function(S, require, exports, module) {
  _$jscoverage['/kison/item.js'].functionData[0]++;
  _$jscoverage['/kison/item.js'].lineData[7]++;
  var Base = require('base');
  _$jscoverage['/kison/item.js'].lineData[9]++;
  function equals(s1, s2) {
    _$jscoverage['/kison/item.js'].functionData[1]++;
    _$jscoverage['/kison/item.js'].lineData[10]++;
    for (var i in s1) {
      _$jscoverage['/kison/item.js'].lineData[11]++;
      if (visit83_11_1(!(i in s2))) {
        _$jscoverage['/kison/item.js'].lineData[12]++;
        return false;
      }
    }
    _$jscoverage['/kison/item.js'].lineData[16]++;
    for (i in s2) {
      _$jscoverage['/kison/item.js'].lineData[17]++;
      if (visit84_17_1(!(i in s1))) {
        _$jscoverage['/kison/item.js'].lineData[18]++;
        return false;
      }
    }
    _$jscoverage['/kison/item.js'].lineData[22]++;
    return true;
  }
  _$jscoverage['/kison/item.js'].lineData[29]++;
  module.exports = Base.extend({
  equals: function(other, ignoreLookAhead) {
  _$jscoverage['/kison/item.js'].functionData[2]++;
  _$jscoverage['/kison/item.js'].lineData[31]++;
  var self = this;
  _$jscoverage['/kison/item.js'].lineData[32]++;
  if (visit85_32_1(!other.get('production').equals(self.get('production')))) {
    _$jscoverage['/kison/item.js'].lineData[33]++;
    return false;
  }
  _$jscoverage['/kison/item.js'].lineData[35]++;
  if (visit86_35_1(other.get('dotPosition') !== self.get('dotPosition'))) {
    _$jscoverage['/kison/item.js'].lineData[36]++;
    return false;
  }
  _$jscoverage['/kison/item.js'].lineData[38]++;
  if (visit87_38_1(!ignoreLookAhead)) {
    _$jscoverage['/kison/item.js'].lineData[39]++;
    if (visit88_39_1(!equals(self.get('lookAhead'), other.get('lookAhead')))) {
      _$jscoverage['/kison/item.js'].lineData[40]++;
      return false;
    }
  }
  _$jscoverage['/kison/item.js'].lineData[43]++;
  return true;
}, 
  toString: function(ignoreLookAhead) {
  _$jscoverage['/kison/item.js'].functionData[3]++;
  _$jscoverage['/kison/item.js'].lineData[47]++;
  return this.get('production').toString(this.get('dotPosition')) + (ignoreLookAhead ? '' : (',' + S.keys(this.get('lookAhead')).join('/')));
}, 
  addLookAhead: function(ls) {
  _$jscoverage['/kison/item.js'].functionData[4]++;
  _$jscoverage['/kison/item.js'].lineData[53]++;
  var lookAhead = this.get('lookAhead'), ret = 0;
  _$jscoverage['/kison/item.js'].lineData[54]++;
  S.each(ls, function(_, l) {
  _$jscoverage['/kison/item.js'].functionData[5]++;
  _$jscoverage['/kison/item.js'].lineData[55]++;
  if (visit89_55_1(!lookAhead[l])) {
    _$jscoverage['/kison/item.js'].lineData[56]++;
    lookAhead[l] = 1;
    _$jscoverage['/kison/item.js'].lineData[57]++;
    ret = 1;
  }
});
  _$jscoverage['/kison/item.js'].lineData[60]++;
  return ret;
}}, {
  ATTRS: {
  production: {}, 
  dotPosition: {
  value: 0}, 
  lookAhead: {
  value: {}}}});
});
