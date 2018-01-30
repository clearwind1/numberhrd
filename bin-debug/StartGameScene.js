/**
 * Created by pior on 16/9/9.
 */
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
var StartGameScene = (function (_super) {
    __extends(StartGameScene, _super);
    function StartGameScene() {
        return _super.call(this) || this;
    }
    StartGameScene.prototype.init = function () {
        BGMPlayer._i().play(SoundName.startgamebgm);
        var data = {
            'code': 1
        };
        this.show(data);
    };
    //拼图 1，上传图片  2，分解图片  3，打乱图片  4，判断图片还原
    StartGameScene.prototype.show = function (data) {
        if (data['code'] == 1) {
            this.showbg();
            //PlayerData._i().UserInfo.ID = data['userid'];
            //console.log('PlayerData._i().UserInfo.ID=========', PlayerData._i().UserInfo.ID);
        }
        else {
            GameUtil.trace(data['msg']);
        }
    };
    StartGameScene.prototype.initGrid = function () {
        for (var i = 0; i < Math.floor(this.stage.stageWidth / 50); i++) {
            var y = i * 50, gridItemY = this.gridLine(0, y, this.stage.stageWidth, y);
            this.addChild(gridItemY);
        }
        for (var i = 0; i < Math.floor(this.stage.stageHeight / 50); i++) {
            var x = i * 50, gridItemX = this.gridLine(x, 0, x, this.stage.stageHeight);
            this.addChild(gridItemX);
        }
    };
    StartGameScene.prototype.gridLine = function (x, y, x1, y1) {
        var shap = new egret.Shape();
        shap.graphics.lineStyle(1, 0x00ff00);
        shap.graphics.moveTo(x, y);
        shap.graphics.lineTo(x1, y1);
        shap.graphics.endFill();
        return shap;
    };
    StartGameScene.prototype.showbg = function () {
        // this.initGrid();
        // return;
        // console.log('this.mStageW====', this.mStageW, '\nthis.mStageH=====', this.mStageH);
        // var bg: MyBitmap = new MyBitmap(RES.getRes('startgamebg_jpg'), this.mStageW / 2, this.mStageH / 2);
        // this.addChild(bg);
        var shap = new MyBitmap(RES.getRes('startgamebg_jpg'), 0, 0);
        shap.setanchorOff(0, 0);
        shap.width = this.mStageW;
        shap.height = this.mStageH;
        this.addChild(shap);
        var posx = this.mStageW / 2;
        var posy = this.mStageH / 2;
        var btnname = 'btn_png';
        var fun = this.startgame;
        var btn = new GameUtil.Menu(this, btnname, btnname, fun, [1]);
        btn.setScaleMode();
        btn.addButtonText('开始游戏', 30);
        this.addChild(btn);
        btn.x = posx;
        btn.y = posy;
        if (!GameConfig.DEBUG) {
            //分享游戏
            if (GameUtil.getQueryString('shareopenid')) {
                this.getshare();
            }
            else {
                //SharePage._i().getSignPackage();
                //SharePage._i().setNewUrl('http://' + GameConfig.GAMENAME + '.h5.gamexun.com/?shareopenid=' + PlayerData._i().UserInfo.openid);
            }
        }
    };
    StartGameScene.prototype.chooseLevel = function () {
        var cl = new tipcontain([this, this.startgame]);
        this.addChild(cl);
    };
    StartGameScene.prototype.getshare = function () {
        var param = {
            shareopenid: GameUtil.getQueryString('shareopenid'),
        };
        GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/updatesharedata", this.setshareresult, this);
    };
    StartGameScene.prototype.setshareresult = function (data) {
        if (data['code'] == 1) {
            //SharePage._i().getSignPackage();
            //SharePage._i().setNewUrl('http://' + GameConfig.GAMENAME + '.h5.gamexun.com/?shareopenid=' + PlayerData._i().UserInfo.openid);
        }
        else {
            GameUtil.trace(data['msg']);
        }
    };
    /**开始游戏 */
    StartGameScene.prototype.startgame = function (gametypeID) {
        GameUtil.trace('gametypeID====', gametypeID);
        GameConfig.GAMETYPEID = gametypeID;
        GameUtil.trace('startgame');
        GameUtil.GameScene.runscene(new GameScene());
    };
    /**游戏排行榜 */
    StartGameScene.prototype.gamerank = function () {
        GameUtil.trace('gamerank');
        this.addChild(new GameRankPageShow());
    };
    /**游戏帮助 */
    StartGameScene.prototype.gamehelp = function () {
        GameUtil.trace('gamehelp');
        this.addChild(new GameHelpPageShow());
    };
    /**游戏设置，音乐与音效 */
    StartGameScene.prototype.setting = function () {
        GameUtil.trace('setting');
        this.addChild(new GameSetting());
    };
    /**游戏分享 */
    StartGameScene.prototype.share = function () {
        GameUtil.trace('share');
        if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
        }
        else {
            this.addChild(new SharePageShow());
        }
    };
    /**更多游戏 */
    StartGameScene.prototype.moregame = function () {
        //this.addChild(new MoreGamePage());
    };
    return StartGameScene;
}(GameUtil.BassPanel));
__reflect(StartGameScene.prototype, "StartGameScene");
var tipcontain = (function (_super) {
    __extends(tipcontain, _super);
    function tipcontain(parm) {
        return _super.call(this, parm) || this;
    }
    tipcontain.prototype.show = function (parm) {
        this.target = parm[0];
        this.callback = parm[1];
        this.createBtn(this.mStageW / 2, this.mStageH / 2 - 100, this.callFun, 0, '简单');
        this.createBtn(this.mStageW / 2, this.mStageH / 2 + 100, this.callFun, 1, '困难');
    };
    tipcontain.prototype.callFun = function (param) {
        this.callback.apply(this.target, [param]);
        this.close();
    };
    tipcontain.prototype.createBtn = function (posx, posy, fun, type, text) {
        var btnname = '';
        var btn = new GameUtil.Menu(this, btnname, btnname, fun, [type]);
        btn.setScaleMode();
        btn.addButtonShap(GameUtil.createRect(0, 0, 300, 60, 1, 0x3399fe, 40, 50), -150, -30);
        btn.addButtonText(text, 30);
        this.addChild(btn);
        btn.x = posx;
        btn.y = posy;
    };
    return tipcontain;
}(Othercontainer));
__reflect(tipcontain.prototype, "tipcontain");
//# sourceMappingURL=StartGameScene.js.map