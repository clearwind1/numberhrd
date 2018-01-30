/**
 * Create by hardy on 16/12/21
 * 主游戏场景
 */
class GameScene extends GameUtil.BassPanel {

    private intervalarr: number[];
    private touchlayer: egret.Shape;
    private beginpointx: number;
    private beginpointy: number;

    private hightscore: number;
    private curscore: number;
    private lvimg: MyBitmap;

    private gamedata: number[];
    private gamescene: egret.DisplayObjectContainer;
    private sourcepic: egret.Texture;
    public constructor() {
        super();
    }
    public init() {
        BGMPlayer._i().play(SoundName.gamebgm);
        this.initdata();
        this.showbg();
    }
    private initdata() {
        this.gamedata = [];
        this.hightscore = 0;
        this.curscore = 0;
        GameData._i().gamescore = 1000;
        this.beginpointx = 0;
        this.beginpointy = 0;
        window['scene'] = this;
    }
    /**
     * 初始化游戏数据
     */
    private initgamedata(level) {
        this.intervalarr = [];
        this.pic = [];
        this.picarr = [];
        this.testtex = [];
        this.time = 60 + (100 - 1) * 30;
        this.timet.setText('Time:' + this.time + 's');
        this.levle = level;
        this.levlet.setText('Level:' + this.levle);
        this.rowcol = (this.levle + 1);

        this.gamestate = true;
        this.gamescene.removeChildren();
    }
    /**
     * 初始化游戏画面
     */
    private initgame() {

        var h = 500 >= this.mStageH ? (this.mStageH - 100) : 400;
        var offx = (this.mStageW - h) / 2;
        var offy = 100 + (this.mStageH - 150 - h) / 2;
        for (var i = 0; i < (this.rowcol * this.rowcol); i++) {
            var square = new Square(i + 1, h / this.rowcol);
            square.x = offx + (i % this.rowcol) * h / this.rowcol;
            square.y = offy + Math.floor(i / this.rowcol) * h / this.rowcol;
            this.pic[i] = square;
            this.pic[i].name = '' + i;
            this.gamescene.addChild(this.pic[i]);
            this.picarr.push(this.pic[i]);

            this.gamedata[i] = i;
        }
        if (GameConfig.GAMETYPEID == 1) {
            this.gamescene.getChildAt(this.gamescene.numChildren - 1).$setAlpha(0);
            for (var i = 0; i < 100; i++) {
                var e = RandomUtils.limitInteger(KEYCODE.LEFT, KEYCODE.DOWN);
                switch (e) {
                    case KEYCODE.DOWN:
                        this.movedown();
                        break;
                    case KEYCODE.LEFT:
                        this.moveleft();
                        break;
                    case KEYCODE.RIGHT:
                        this.moveright();
                        break;
                    case KEYCODE.UP:
                        this.moveup();
                        break;
                }
            }

            this.gamestate = false;
        }
        else {
            for (var i = 0; i < this.gamescene.numChildren; i++) {
                var tempic: egret.Bitmap = <egret.Bitmap>this.gamescene.getChildAt(i);
                var rdt = RandomUtils.limitInteger(0, this.gamescene.numChildren - 1);
                var rtpic: egret.Bitmap = <egret.Bitmap>this.gamescene.getChildAt(rdt);
                GameUtil.changePositionA2B(tempic, rtpic);

                var indexc = this.picarr.indexOf(tempic);
                var indexr = this.picarr.indexOf(rtpic);
                this.picarr[indexc] = rtpic;
                this.picarr[indexr] = tempic;

                var tt = this.gamedata[i];
                this.gamedata[i] = this.gamedata[rdt];
                this.gamedata[rdt] = tt;
            }
        }
        this.gameinterval();
    }
    /**
     * 显示背景
     */
    private pic: egret.Sprite[];
    private testtex: GameUtil.MyTextField[];
    private timet: GameUtil.MyTextField;
    private time: number;
    private levlet: GameUtil.MyTextField;
    private levle: number;
    private rowcol: number;
    private picarr: any[];
    private gamestate: boolean = true;
    private showbg() {

        var gamebg = new MyBitmap(RES.getRes('gamebg_png'), 0, 0);
        gamebg.setanchorOff(0, 0);
        gamebg.width = this.mStageW;
        gamebg.height = this.mStageH;
        this.addChild(gamebg);

        var bgimg: MyBitmap = new MyBitmap(RES.getRes('timg_jpeg'), 0, 0);
        bgimg.setanchorOff(0, 0);
        bgimg.width = this.mStageW;
        bgimg.height = this.mStageH;
        bgimg.$setAlpha(0.6);
        this.addChild(bgimg);

        var posx = 10;
        var posy = this.mStageH / 2;
        var text = new GameUtil.MyTextField(posx, 65, 20, 0, 0);
        text.setText('');
        this.addChild(text);
        if (GameConfig.GAMETYPEID == 0) {
            text.setText('点击两张不同的图片碎片，交换位置，直至完成拼图');
        } else {
            text.setText('点击空缺位置周围的图片数字，移动位置，直至数字按顺序排列或者使用键盘上下\n左右键来移动');
        }
        // return;
        this.intervalarr = [];
        this.pic = [];
        this.picarr = [];
        this.testtex = [];
        this.time = 60 + (100 - 1) * 30;
        this.timet = new GameUtil.MyTextField(this.mStageW / 2 + 50, 40, 30, 0, 0.5);
        this.timet.setText('Time:' + this.time + 's');
        this.timet.textColor = 0x37b4c7;
        this.addChild(this.timet);

        this.levle = 1;
        this.levlet = new GameUtil.MyTextField(this.mStageW / 2 - 100, 40, 30, 0, 0.5);
        this.levlet.setText('Level:' + this.levle);
        this.levlet.textColor = 0x37b4c7;
        this.addChild(this.levlet);
        this.gamescene = new egret.DisplayObjectContainer();
        this.addChild(this.gamescene);

        this.rowcol = this.levle + 1;;

        var btnname = '';
        var fun = this.chooseImg;
        var btn = new GameUtil.Menu(this, btnname, btnname, fun, []);
        btn.setScaleMode();
        btn.addButtonShap(GameUtil.createRect(0, 0, 200, 60, 1, 0x3399fe, 40, 50), -100, -30);
        btn.addButtonText('请选择', 30);
        //this.addChild(btn);
        btn.x = posx;
        btn.y = posy;
        var text = new GameUtil.MyTextField(posx, posy + 40, 30, 0.5, 0);
        text.width = 200;
        text.setText('点击上面的按钮选择自己的图片');
        //this.addChild(text);

        this.initgame();
        if (GameConfig.GAMETYPEID == 1) {
            window.addEventListener('keydown', (e) => {
                switch (e.keyCode) {
                    case KEYCODE.DOWN:
                        this.movedown();
                        break;
                    case KEYCODE.LEFT:
                        this.moveleft();
                        break;
                    case KEYCODE.RIGHT:
                        this.moveright();
                        break;
                    case KEYCODE.UP:
                        this.moveup();
                        break;
                }
            }, false);
        }
        this.gamescene.touchEnabled = true;
        this.gamescene.addEventListener(egret.TouchEvent.TOUCH_TAP, this.touchtap, this);
    }

    private selectedpic: egret.Bitmap = null;
    private touchtap(e: egret.TouchEvent) {

        if (GameData._i().GamePause) {
            return;
        }

        if (GameConfig.GAMETYPEID == 0) {
            for (var i = 0; i < this.gamescene.numChildren; i++) {
                var pic: any = this.gamescene.getChildAt(i);
                if (pic.$hitTest(e.stageX, e.stageY)) {
                    //console.log('picname====', pic.name);
                    if (this.selectedpic != null) {
                        GameUtil.changePositionA2B(this.selectedpic, pic);
                        var nn = Number(this.selectedpic.name);
                        var tt = this.gamedata[nn];
                        this.gamedata[nn] = this.gamedata[Number(pic.name)];
                        this.gamedata[Number(pic.name)] = tt;
                        this.selectedpic = null;
                        this.checkgameover();
                    } else {
                        this.selectedpic = pic;
                    }
                    break;
                }
            }
        } else {
            for (var i = 0; i < this.gamescene.numChildren; i++) {
                var pic: any = this.picarr[i];
                if (pic.$hitTest(e.stageX, e.stageY)) {
                    var index = this.picarr.indexOf(pic);
                    //console.log('picname====', pic.name, "--------i=====", this.picarr.indexOf(pic));
                    var leftindex = (index % this.rowcol == 0 ? index : index - 1);
                    var rightindex = ((index + 1) % this.rowcol == 0 ? index : index + 1);
                    var upindex = index - this.rowcol >= 0 ? index - this.rowcol : index;
                    var downindex = index + this.rowcol >= this.rowcol * this.rowcol ? index : index + this.rowcol;

                    var lastpic = null;
                    var lastname = '' + (this.rowcol * this.rowcol - 1);
                    do {
                        if (this.picarr[leftindex].name == lastname) {
                            lastpic = this.picarr[leftindex];
                            break;
                        }
                        if (this.picarr[rightindex].name == lastname) {
                            lastpic = this.picarr[rightindex];
                            break;
                        }
                        if (this.picarr[upindex].name == lastname) {
                            lastpic = this.picarr[upindex];
                            break;
                        }
                        if (this.picarr[downindex].name == lastname) {
                            lastpic = this.picarr[downindex];
                            break;
                        }

                    } while (false);
                    if (lastpic != null) {
                        this.changeAcheck(pic, lastpic);
                    }
                    break;
                }
            }
        }
    }

    private changeAcheck(pic, lastpic) {
        GameUtil.changePositionA2B(pic, lastpic);

        var nn = Number(lastpic.name);
        var tt = this.gamedata[nn];
        this.gamedata[nn] = this.gamedata[Number(pic.name)];
        this.gamedata[Number(pic.name)] = tt;

        var indexc = this.picarr.indexOf(pic);
        var indexr = this.picarr.indexOf(lastpic);
        this.picarr[indexc] = lastpic;
        this.picarr[indexr] = pic;

        //console.log('picname====', pic.name, "--------i=====", this.picarr.indexOf(pic));
        if (!this.gamestate) {
            this.checkgameover();
        }
    }

    private movedown() {
        for (var i = 0; i < this.gamescene.numChildren; i++) {
            var lastname = '' + (this.rowcol * this.rowcol - 1);
            var lastpic = this.picarr[i];
            if (lastpic.name == lastname) {
                var index = (i - this.rowcol) >= 0 ? (i - this.rowcol) : i;
                var pic = this.picarr[index];
                this.changeAcheck(pic, lastpic);
                break;
            }
        }
    }
    private moveleft() {
        for (var i = 0; i < this.gamescene.numChildren; i++) {
            var lastname = '' + (this.rowcol * this.rowcol - 1);
            var lastpic = this.picarr[i];
            if (lastpic.name == lastname) {
                var index = ((i + 1) % this.rowcol) == 0 ? i : i + 1;
                var pic = this.picarr[index];
                this.changeAcheck(pic, lastpic);
                break;
            }
        }
    }
    private moveright() {
        for (var i = 0; i < this.gamescene.numChildren; i++) {
            var lastname = '' + (this.rowcol * this.rowcol - 1);
            var lastpic = this.picarr[i];
            if (lastpic.name == lastname) {
                var index = (i) % this.rowcol == 0 ? i : i - 1;
                var pic = this.picarr[index];
                this.changeAcheck(pic, lastpic);
                break;
            }
        }
    }
    private moveup() {
        for (var i = 0; i < this.gamescene.numChildren; i++) {
            var lastname = '' + (this.rowcol * this.rowcol - 1);
            var lastpic = this.picarr[i];
            if (lastpic.name == lastname) {
                var index = (i + this.rowcol) >= this.rowcol * this.rowcol ? i : i + this.rowcol;
                var pic = this.picarr[index];
                this.changeAcheck(pic, lastpic);
                break;
            }
        }
    }

    /**游戏定时器 */
    private gameinterval() {
        GameUtil.trace('interval');
        var timeint = egret.setInterval(() => {
            this.time--;
            this.timet.setText('Time:' + this.time + 's');
            if (this.time == 0) {
                this.gameover();
            }
        }, this, 1000);
        this.intervalarr.push(timeint);
        //this.gameover();
    }

    private updataGamedata() {

    }

    //检测下一关    
    private checkgameover() {

        var bgameover = true;
        for (var i = 0; i < this.gamescene.numChildren; i++) {
            if (i != this.gamedata[i]) {
                //console.log('i====', i, '\n this.gamedata[i]====', this.gamedata[i]);
                bgameover = false;
                break;
            }
        }

        if (bgameover) {
            this.nextlevelgame();
        }
    }

    private touchbegin(evt: egret.TouchEvent) {

        if (GameData._i().GamePause) {
            return;
        }
        GameData._i().GamePause = true;
    }

    private chooseImg() {
        var uploadImg: any = document.getElementById("uploadImg");
        uploadImg.onchange = this.onChang;
        uploadImg.click();
    }
    private onChang() {
        //获取选择图片
        var uploadImg: any = document.getElementById("uploadImg");
        var file = uploadImg.files[0];
        //判断图片类型
        var imageType = /^image\//;
        if (!imageType.test(file.type)) {
            alert("请选择图片类型上传");
            return;
        }
        //加载图片
        window['scene'].loadFileComplete(window.URL.createObjectURL(file));
    }
    public loadFileComplete(result) {
        //将加载图片的数据赋值给myImg
        RES.getResByUrl(result, (data) => {
            this.sourcepic = <egret.Texture>data;
            this.clearinter();
            var level = 1;
            this.initgamedata(level);
            this.initgame();
        }, this, RES.ResourceItem.TYPE_IMAGE);

    }

    /**游戏结束 */
    public gameover() {
        GameUtil.trace('gameover');
        GameData._i().GamePause = true;
        this.clearinter();
        //this.gametime.stop();
        //egret.Tween.removeAllTweens();

        var cont = new egret.DisplayObjectContainer();
        this.addChild(cont);
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.4, 0x000000);
        cont.addChild(shap);

        var posx = this.mStageW / 2;
        var posy = this.mStageH / 2;
        var text = new GameUtil.MyTextField(posx, posy - 40, 70, 0.5, 0.5);
        text.textColor = 0xff0000;
        text.setText('游戏结束');
        cont.addChild(text);

        var btnname = '';
        var fun = () => {
            GameData._i().GamePause = false;
            this.removeChild(cont);
            var level = 1;
            this.initgamedata(level);
            this.initgame();
        };
        var btn = new GameUtil.Menu(this, btnname, btnname, fun);
        btn.setScaleMode();
        btn.addButtonShap(GameUtil.createRect(0, 0, 300, 70, 1, 0x3399fe, 40, 50), -150, -35);
        btn.addButtonText('重新开始', 50);
        cont.addChild(btn);
        btn.x = posx;
        btn.y = posy + 40;

    }
    /**
     *下一关
     */
    private nextlevelgame() {
        this.clearinter();
        // if (GameConfig.GAMETYPEID == 1) {
        //     (<egret.Bitmap>this.picarr[this.pic.length - 1]).$setAlpha(1);
        // }

        var cont = new egret.DisplayObjectContainer();
        this.addChild(cont);
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.4, 0x000000);
        cont.addChild(shap);
        cont.$setTouchEnabled(true);

        var posx = this.mStageW / 2;
        var posy = this.mStageH / 2;
        var text = new GameUtil.MyTextField(posx, posy, 80, 0.5, 0.5);
        text.textColor = 0x37b4c7;
        text.setText('恭喜过关');
        cont.addChild(text);

        var btnname = 'btn_png';
        var btn = new GameUtil.Menu(this, btnname, btnname, () => {
            this.removeChild(cont);
            var level = this.levle + 1;
            this.initgamedata(level);
            this.initgame();
        }, []);
        btn.setScaleMode();
        btn.addButtonText('下一关', 30);
        cont.addChild(btn);
        btn.x = posx;
        btn.y = posy+100;
    }

    /**重置游戏数据 */
    public reset() {
        this.gameinterval();
        this.restart();
    }
    /**清除定时器 */
    private clearinter() {
        GameUtil.clearinterval(this.intervalarr);
        // for (var i: number = 0; i < this.enemyContain.numChildren; i++) {
        //     var enemysp: EnemySprite = <EnemySprite>this.enemyContain.getChildAt(i);
        //     GameUtil.clearinterval(enemysp.intervalarr);
        // }
    }

    private exitgame() {
        GameUtil.GameScene.runscene(new StartGameScene());
    }

    private restartask() {
        var askcon: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        this.addChild(askcon);
        askcon.touchEnabled = true;
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        askcon.addChild(shap);

        var bgname: string = 'restartbg_png';
        var gameoverbg: MyBitmap = new MyBitmap(RES.getRes(bgname), this.mStageW / 2, this.mStageH / 2);
        askcon.addChild(gameoverbg);
        var bgtext: MyBitmap = new MyBitmap(RES.getRes('restarttext_png'), 330, 80, gameoverbg);
        askcon.addChild(bgtext);

        var btname: string[] = ['yesbtn_png', 'nobtn_png'];
        var btnfun: Function[] = [this.restart,];
        for (var i: number = 0; i < 2; i++) {
            var btn: GameUtil.Menu = new GameUtil.Menu(this, btname[i], btname[i], (id) => {
                askcon.parent.removeChild(askcon);
                if (id == 0) {
                    this.restart();
                }
            }, [i]);
            askcon.addChild(btn);
            GameUtil.relativepos(btn, gameoverbg, 175 + 290 * i, 260);
        }
    }
    public restart() {
        GameData._i().gamescore = 0;
        this.curscore = 0;
        this.hightscore = 2;
        console.log('restart');
        //this.restart();
    }
}