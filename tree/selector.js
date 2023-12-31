"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var element_1 = tslib_1.__importDefault(require("./element"));
var less_error_1 = tslib_1.__importDefault(require("../less-error"));
var utils = tslib_1.__importStar(require("../utils"));
var parser_1 = tslib_1.__importDefault(require("../parser/parser"));
var Selector = function (elements, extendList, condition, index, currentFileInfo, visibilityInfo) {
    this.extendList = extendList;
    this.condition = condition;
    this.evaldCondition = !condition;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.elements = this.getElements(elements);
    this.mixinElements_ = undefined;
    this.copyVisibilityInfo(visibilityInfo);
    this.setParent(this.elements, this);
};
Selector.prototype = Object.assign(new node_1.default(), {
    type: 'Selector',
    accept: function (visitor) {
        if (this.elements) {
            this.elements = visitor.visitArray(this.elements);
        }
        if (this.extendList) {
            this.extendList = visitor.visitArray(this.extendList);
        }
        if (this.condition) {
            this.condition = visitor.visit(this.condition);
        }
    },
    createDerived: function (elements, extendList, evaldCondition) {
        elements = this.getElements(elements);
        var newSelector = new Selector(elements, extendList || this.extendList, null, this.getIndex(), this.fileInfo(), this.visibilityInfo());
        newSelector.evaldCondition = (!utils.isNullOrUndefined(evaldCondition)) ? evaldCondition : this.evaldCondition;
        newSelector.mediaEmpty = this.mediaEmpty;
        return newSelector;
    },
    getElements: function (els) {
        if (!els) {
            return [new element_1.default('', '&', false, this._index, this._fileInfo)];
        }
        if (typeof els === 'string') {
            new parser_1.default(this.parse.context, this.parse.importManager, this._fileInfo, this._index).parseNode(els, ['selector'], function (err, result) {
                if (err) {
                    throw new less_error_1.default({
                        index: err.index,
                        message: err.message
                    }, this.parse.imports, this._fileInfo.filename);
                }
                els = result[0].elements;
            });
        }
        return els;
    },
    createEmptySelectors: function () {
        var el = new element_1.default('', '&', false, this._index, this._fileInfo), sels = [new Selector([el], null, null, this._index, this._fileInfo)];
        sels[0].mediaEmpty = true;
        return sels;
    },
    match: function (other) {
        var elements = this.elements;
        var len = elements.length;
        var olen;
        var i;
        other = other.mixinElements();
        olen = other.length;
        if (olen === 0 || len < olen) {
            return 0;
        }
        else {
            for (i = 0; i < olen; i++) {
                if (elements[i].value !== other[i]) {
                    return 0;
                }
            }
        }
        return olen; // return number of matched elements
    },
    mixinElements: function () {
        if (this.mixinElements_) {
            return this.mixinElements_;
        }
        var elements = this.elements.map(function (v) {
            return v.combinator.value + (v.value.value || v.value);
        }).join('').match(/[,&#*.\w-]([\w-]|(\\.))*/g);
        if (elements) {
            if (elements[0] === '&') {
                elements.shift();
            }
        }
        else {
            elements = [];
        }
        return (this.mixinElements_ = elements);
    },
    isJustParentSelector: function () {
        return !this.mediaEmpty &&
            this.elements.length === 1 &&
            this.elements[0].value === '&' &&
            (this.elements[0].combinator.value === ' ' || this.elements[0].combinator.value === '');
    },
    eval: function (context) {
        var evaldCondition = this.condition && this.condition.eval(context);
        var elements = this.elements;
        var extendList = this.extendList;
        elements = elements && elements.map(function (e) { return e.eval(context); });
        extendList = extendList && extendList.map(function (extend) { return extend.eval(context); });
        return this.createDerived(elements, extendList, evaldCondition);
    },
    genCSS: function (context, output) {
        var i, element;
        if ((!context || !context.firstSelector) && this.elements[0].combinator.value === '') {
            output.add(' ', this.fileInfo(), this.getIndex());
        }
        for (i = 0; i < this.elements.length; i++) {
            element = this.elements[i];
            element.genCSS(context, output);
        }
    },
    getIsOutput: function () {
        return this.evaldCondition;
    }
});
exports.default = Selector;
//# sourceMappingURL=selector.js.map