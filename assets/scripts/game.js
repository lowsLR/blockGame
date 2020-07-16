// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		blockNode: cc.Node,
		baseNodeArr: [cc.Node],
		wallNodeArr: [cc.Node],
		scoreLabel: cc.Label,
	},

	// LIFE-CYCLE CALLBACKS: 

	onLoad() {
		this.node.on('touchstart', this.grow, this);
		this.node.on('touchend', this.stop, this);
		this.init();
	},
	//初始化
	init() {
		this.score = 0;
		this.goLack();
	},
	// 注销玩家输入事件
	onDestroy() {
		this.node.off('touchstart', this.grow, this);
		this.node.off('touchend', this.stop, this);
	},
	// 鼠标点击事件 
	grow() {
		if (this.gameState != 'idle') return;
		this.gameState = 'grow';
		let seq = cc.sequence(
			cc.scaleTo(1, 4),
			cc.callFunc(() => {})
		)
		this.growAction = this.blockNode.runAction(seq)
	},
	// 鼠标松开事件 
	stop() {
		if (this.gameState != 'grow') return;
		this.gameState = 'rota';
		this.blockNode.stopAction(this.growAction);
		let rota = cc.sequence(
			cc.rotateTo(0.15, 0),
			cc.callFunc(() => {
				if (this.blockNode.width * this.blockNode.scaleX <= this.baseNodeArr[1].x - this.baseNodeArr[0].x) {
					// cc.log("掉落了")
					this.blockNode.runAction(cc.sequence(
						cc.moveTo(0.7, cc.v2(0, -1000)),
						cc.callFunc(() => {
							this.gameOver()
						})
					))
				} else {
					// cc.log("碰撞了")
					if (this.blockNode.width * this.blockNode.scaleX <= this.wallNodeArr[1].x - this.wallNodeArr[0].x) {
						this.bouce(true)
					} else {
						this.bouce(false)
					}
				}
			})
		)
		this.rotateToAction = this.blockNode.runAction(rota);
	},
	// 碰撞
	bouce(success) {
		let desY = -(cc.winSize.height / 2 - this.blockNode.height * this.blockNode.scaleX / 2 - this.baseNodeArr[0].height);
		if (!success) {
			desY += this.wallNodeArr[0].height;
		}
		this.blockNode.runAction(cc.sequence(
			cc.moveTo(0.7, cc.v2(0, desY)).easing(cc.easeBounceOut()),
			cc.callFunc(() => {
				// cc.log("碰撞");
				if (success) {
					this.goLack();
					this.updataScore(1);
				} else {
					this.gameOver();
				}

			})
		))
	},
	//碰撞后的状态
	goLack(){
		this.gameState = 'idle';
		this.resetWall();
		this.resetBlock();
		this.resetColor();
	},
	//游戏结束
	gameOver() {
		// cc.log("游戏结束")
		cc.director.loadScene('game') //重新加载游戏
	},
	//目标位置
	placeWall(node, desX) {
		node.runAction(cc.moveTo(0.5, cc.v2(desX, node.y)).easing(cc.easeQuinticActionIn()))
	},
	// 设置颜色变化
	resetColor(){
		let colors = ['#4cb4e7','#ffc09f','#c7b3e5','#588c7e','#a3a380'];
		this.node.color = cc.Color.BLACK.fromHEX(colors[parseInt(Math.random()*colors.length)]);
	},
	// 设置面阻拦方块
	resetWall() {
		//设置随机下面阻拦方块的边距距离s
		let baseGap = 100 + Math.random() * 100;
		let wallGap = baseGap + Math.random() * 80 + 30;
		this.placeWall(this.baseNodeArr[0], -baseGap / 2);
		this.placeWall(this.baseNodeArr[1], baseGap / 2);
		this.placeWall(this.wallNodeArr[0], -wallGap / 2);
		this.placeWall(this.wallNodeArr[1], wallGap / 2);
	}, 
	// 设置小方块
	resetBlock() {
		this.blockNode.runAction(cc.sequence(
			cc.spawn(
				cc.rotateTo(0.5, -45),
				cc.moveTo(0.7, cc.v2(0, 400)),
				cc.scaleTo(0.5, 1)
			),
			cc.callFunc(() => {})
		))
	},
	//更新分数
	updataScore(incr) {
		this.score += incr;
		this.scoreLabel.string = this.score;
	},
	start() {

	},

	// update (dt) {}
});
