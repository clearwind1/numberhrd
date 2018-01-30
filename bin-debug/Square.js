// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Square = (function (_super) {
    __extends(Square, _super);
    function Square(id, h) {
        var _this = _super.call(this) || this;
        _this.initdata(id, h);
        return _this;
    }
    Square.prototype.initdata = function (id, h) {
        this.id = id;
        this.graphics.beginFill(0x000000, 1);
        this.graphics.drawRect(0, 0, h, h);
        this.graphics.endFill();
        var shap = GameUtil.createRect(1, 1, h - 2, h - 2, 1, 0xffffff);
        this.addChild(shap);
        var tx = new GameUtil.MyTextField(h / 2, h / 2, 40, 0.5, 0.5);
        tx.setText('' + id);
        this.addChild(tx);
    };
    return Square;
}(egret.Sprite));
__reflect(Square.prototype, "Square");
//# sourceMappingURL=Square.js.map