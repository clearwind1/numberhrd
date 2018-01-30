/**
 * Create by hardy on  16/12/21
 */
class Othercontainer extends GameUtil.BassPanel {
    public constructor(parm?:any[]) {
        super(parm);
    }

    public init(parm?:any[]) {
        this.touchEnabled = true;
        var shap: egret.Shape = GameUtil.createRect(0, 0, this.mStageW, this.mStageH, 0.6);
        this.addChild(shap);

        this.show(parm);
    }

    protected show(parm?:any[]) {

    }

    protected close() {
        egret.Tween.removeAllTweens();
        this.removeChildren();
        this.parent.removeChild(this);
    }

}