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
/**
 * Create by hardy on 16/12/21
 * 游戏结束页面
 */
var GameOverPageShow = (function (_super) {
    __extends(GameOverPageShow, _super);
    function GameOverPageShow() {
        return _super.call(this) || this;
    }
    GameOverPageShow.prototype.show = function () {
        var data = {
            'code': 1
        };
        this.showscene(data);
    };
    /**显示 */
    GameOverPageShow.prototype.showscene = function (data) {
        //console.log('data-====', data['msg']);
        if (data['code'] == 1) {
            var bgname = 'gameoverbg_png';
            var gameoverbg = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
            this.addChild(gameoverbg);
            var bgtext = new MyBitmap(RES.getRes('gameovertext_png'), 315, 60, gameoverbg);
            this.addChild(bgtext);
            //gameover内容
            /**创建按钮 */
            var btname = ['gameoversharebtn_png', 'gameoverrestartbtn_png', 'gameoverretrunbtn_png'];
            var btnfun = [this.share, this.relife, this.turnback];
            for (var i = 0; i < 3; i++) {
                var btn = new GameUtil.Menu(this, btname[i], btname[i], btnfun[i]);
                this.addChild(btn);
                GameUtil.relativepos(btn, gameoverbg, 120 + 190 * i, 340);
            }
        }
        else {
            console.log(data['msg']);
        }
    };
    /**分享 */
    GameOverPageShow.prototype.share = function () {
        if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
        }
        else {
            this.addChild(new SharePageShow());
        }
    };
    /**返回开始界面 */
    GameOverPageShow.prototype.turnback = function () {
        // PlayerData._i().initdata();
        //GameData._i().currgamescore[0] = GameData._i().gamescore;
        GameData._i().GameOver = false;
        GameData._i().gamescore = 0;
        this.close();
        GameUtil.GameScene.runscene(new StartGameScene());
    };
    /**复活 */
    GameOverPageShow.prototype.relife = function () {
        //PlayerData._i().initdata();
        GameData._i().GameOver = false;
        GameData._i().gamescore = 0;
        this.parent.restart();
        this.close();
    };
    return GameOverPageShow;
}(Othercontainer));
__reflect(GameOverPageShow.prototype, "GameOverPageShow");
//# sourceMappingURL=GameOverPageShow.js.map