// TypeScript file

class Square extends egret.Sprite {
    private id: number;
    public constructor(id,h) {
        super();
        this.initdata(id,h);
    }

    private initdata(id,h) {
        this.id = id;
        this.graphics.beginFill(0x000000, 1);
        this.graphics.drawRect(0, 0, h, h);
        this.graphics.endFill();

        var shap: egret.Shape = GameUtil.createRect(1, 1, h-2, h-2,1,0xffffff);
        this.addChild(shap);

        var tx = new GameUtil.MyTextField(h/2, h/2, 40, 0.5, 0.5);
        tx.setText('' + id);
        this.addChild(tx);
    }

}