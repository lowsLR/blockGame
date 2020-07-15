// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		blockNode: cc.Node
	},

	// LIFE-CYCLE CALLBACKS: 

	onLoad() {
		this.node.on('touchstart', this.grow, this)
		this.node.on('touchend', this.stop, this)
	},
	// 注销玩家输入事件
	onDestroy() {
		this.node.off('touchstart', this.grow, this)
		this.node.off('touchend', this.stop, this)
	},
	// 鼠标点击事件
	grow() {
		let seq = cc.sequence(
			cc.scaleTo(1, 4),
			cc.callFunc(() => {})
		)
		this.growAction = this.blockNode.runAction(seq)
	},
	// 鼠标松开事件
	stop() {},
	start() {

	},

	// update (dt) {}
});
