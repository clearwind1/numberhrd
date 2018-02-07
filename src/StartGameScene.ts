/**
 * Created by pior on 16/9/9.
 */

class StartGameScene extends GameUtil.BassPanel {

    public constructor() {
        super();
    }

    public init() {
        BGMPlayer._i().play(SoundName.startgamebgm);
        var data: any = {
            'code': 1
        };
        this.show(data);
    }
    //拼图 1，上传图片  2，分解图片  3，打乱图片  4，判断图片还原

    private show(data: any) {
        if (data['code'] == 1) {
            this.showbg();
            //PlayerData._i().UserInfo.ID = data['userid'];
            //console.log('PlayerData._i().UserInfo.ID=========', PlayerData._i().UserInfo.ID);
        }
        else {
            GameUtil.trace(data['msg']);
        }
    }

    public initGrid(): void{
        for (var i: number = 0; i < Math.floor(this.stage.stageWidth/50); i++){
            let y = i * 50,
                gridItemY = this.gridLine(0, y, this.stage.stageWidth, y);
            this.addChild(gridItemY);
        }
        for (var i: number = 0; i < Math.floor(this.stage.stageHeight/50); i++){
            let x = i * 50,
                gridItemX = this.gridLine(x, 0, x, this.stage.stageHeight);
            this.addChild(gridItemX);
        }
    }
    private gridLine(x, y, x1, y1): egret.Shape{
        var shap = new egret.Shape();
        shap.graphics.lineStyle(1, 0x00ff00);
        shap.graphics.moveTo(x, y);
        shap.graphics.lineTo(x1, y1);
        shap.graphics.endFill();
        return shap;
    }
    /**显示背景界面 */
    private curid: number;
    private showbg() {
        
        // this.initGrid();
        // return;

        // console.log('this.mStageW====', this.mStageW, '\nthis.mStageH=====', this.mStageH);

        // var bg: MyBitmap = new MyBitmap(RES.getRes('startgamebg_jpg'), this.mStageW / 2, this.mStageH / 2);
        // this.addChild(bg);
        var shap: MyBitmap = new MyBitmap(RES.getRes('startgamebg_jpg'), 0, 0);
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
    }

    private chooseLevel() {
        var cl = new tipcontain([this,this.startgame]);
        this.addChild(cl);
    }

    private getshare() {
        var param: Object = {
            shareopenid: GameUtil.getQueryString('shareopenid'),
            //clickopenid: PlayerData._i().UserInfo.openid
        }
        GameUtil.Http.getinstance().send(param, "/" + GameConfig.SERVERNAME + "/updatesharedata", this.setshareresult, this);
    }
    private setshareresult(data: any) {
        if (data['code'] == 1) {
            //SharePage._i().getSignPackage();
            //SharePage._i().setNewUrl('http://' + GameConfig.GAMENAME + '.h5.gamexun.com/?shareopenid=' + PlayerData._i().UserInfo.openid);
        }
        else {
            GameUtil.trace(data['msg']);
        }
    }
    /**开始游戏 */
    private startgame(gametypeID: number) {
        GameUtil.trace('gametypeID====', gametypeID);
        
        GameConfig.GAMETYPEID = gametypeID;
        GameUtil.trace('startgame');
        GameUtil.GameScene.runscene(new GameScene());
    }

    /**游戏排行榜 */
    private gamerank() {
        GameUtil.trace('gamerank');
        this.addChild(new GameRankPageShow());
    }
    /**游戏帮助 */
    private gamehelp() {
        GameUtil.trace('gamehelp');
        this.addChild(new GameHelpPageShow());
    }
    /**游戏设置，音乐与音效 */
    private setting() {
        GameUtil.trace('setting');
        this.addChild(new GameSetting());
    }
    /**游戏分享 */
    private share() {
        GameUtil.trace('share');
        if (!GameUtil.isSomeType(GameConfig.WeiXinstr)) {
            this.addChild(new GameUtil.TipsPanel(null, '请在微信中打开', true));
        } else {
            this.addChild(new SharePageShow());
        }
    }
    /**更多游戏 */
    private moregame() {
        //this.addChild(new MoreGamePage());
    }
}
class tipcontain extends Othercontainer{
    public constructor(parm?:any[]) {
        super(parm);
    }

    private target: any;
    private callback: Function;
    protected show(parm?:any[]) {
        this.target = parm[0];
        this.callback = parm[1];

        this.createBtn(this.mStageW / 2, this.mStageH / 2 - 100, this.callFun, 0, '简单');
        this.createBtn(this.mStageW / 2, this.mStageH / 2 + 100, this.callFun, 1, '困难');

    }
    private callFun(param) {
        this.callback.apply(this.target, [param]);
        this.close();
    }

    private createBtn(posx,posy,fun,type,text) {
        var btnname = '';
        var btn = new GameUtil.Menu(this, btnname, btnname, fun, [type]);
        btn.setScaleMode();
        btn.addButtonShap(GameUtil.createRect(0, 0, 300, 60, 1, 0x3399fe, 40, 50), -150, -30);
        btn.addButtonText(text, 30);
        this.addChild(btn);
        btn.x = posx;
        btn.y = posy;
    }
}